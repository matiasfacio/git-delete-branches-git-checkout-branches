#!/usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");
const { colors } = require('./colors')

const environment = ['dev', 'stage']
const CANCEL = '-cancel-'


const init = async (getCurrentBranch, pushTag, getDesiredEnvironment, buildPartialTagName, buildTag, getConfirmation, createTag, getVersionOrDefault) => {
    let currentBranch;
    await getCurrentBranch((val) => currentBranch = val)
    const envToDeployTo = await getDesiredEnvironment()

    if (envToDeployTo.environments === CANCEL) {
        console.log(colors.fg.red, "tag creation aborted")
        return;
    }

    const partialTagName = buildPartialTagName(envToDeployTo.environments, currentBranch);

    const handleTagCreation = async (value) => {
        const tag = buildTag(partialTagName, value.version)
        const confirm = await getConfirmation(tag)

        if (confirm.accepted) {
            createTag(tag, ()=> pushTag(tag))
        } else {
            console.log(colors.fg.red,"tag creation aborted")
        }
    }

    await getVersionOrDefault(partialTagName, handleTagCreation)
}

const getCurrentBranch = async (cb) => exec("git branch --show-current", async (error, stdout, stderr) => {
        if (error) {
            console.error(colors.fg.red, error);
            return;
        }
        if (stderr) {
            console.error("stderr:", stderr);
        }
        cb(stdout.replace(/(\n$)/gm, ""))
    }
)
const createTag = (tag, cb) => exec(`git tag ${tag}`, (error, stdout, stderr) => {
    if (error) {
        console.error(colors.fg.red, error);
        return;
    }
    if (stderr) {
        console.error("stderr:", stderr);
    }
    console.log(colors.fg.green,"tag created successfully, now pushing to origin...")
    cb()
})
const pushTag = (tag) => exec(`git push origin ${tag}`, (error, stdout, stderr) => {
    if (error) {
        console.error(colors.fg.red, error);
        return;
    }
    if (stderr) {
        console.error("stderr:", stderr);
    }
    console.log("tag pushed successfully")
})


const getDesiredEnvironment = async ()=> {
    return inquirer.prompt([
        {
            type: "list",
            name: "environments",
            message: "Choose environment",
            choices: [...environment, CANCEL],
        },
    ]);
}

const getConfirmation =(tag)=>  inquirer.prompt([
    {
        type: "confirm",
        name: "accepted",
        message: `Do you want to create a tag with the following name: ${tag}`,
    },
]);

const getVersionOrDefault = async (currentTag, cb) => {
    exec('git tag -l', async (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }
        if (stderr) {
            console.error("stderr:", stderr);
        }
        const allTags = stdout.split('\n').filter(Boolean);
        const version = getNextVersion(allTags, currentTag)

        const value = await inquirer.prompt([
            {
                type: "input",
                name: "version",
                message: "Deployment number: ",
                default: version,
            },
        ]);
        cb(value)
    })
}

const getNextVersion =(allTags, currentTag)=>{
    const versions = allTags.filter(tag => tag.includes(currentTag))
    console.log(colors.fg.blue,'Existing tags for current branch:\n', colors.reset, versions.length ? versions : 'none');
    return versions.length > 0 ? Math.max(...versions.map(tag => parseInt(tag.split('_').pop()))) + 1 : 1
}

const buildPartialTagName = (env, branch) => {
    return `${env}_${branch}`
}

const buildTag = (partialTagName, version) => {
    return `${partialTagName}_${version}`
}

init(getCurrentBranch, pushTag, getDesiredEnvironment, buildPartialTagName, buildTag, getConfirmation, createTag, getVersionOrDefault)

