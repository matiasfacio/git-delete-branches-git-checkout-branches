#!/usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");

const environment = ['dev', 'stage']
const init = (pushTag, getDesiredEnvironment, buildPartialTagName, buildTag, getConfirmation, createTag) =>
     exec("git branch --show-current", async (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error("stderr:", stderr);
        }
        const currentBranch = stdout.replace(/(\n$)/gm, "");
        const envToDeployTo = await getDesiredEnvironment()
        const partialTagName = buildPartialTagName(envToDeployTo.environments, currentBranch);

        await getVersionOrDefault(partialTagName, async (value) =>{
            const tag = buildTag(partialTagName, value.version)
            const confirm = await getConfirmation(tag)

            if (confirm.accepted) {
                createTag(tag, pushTag)
            } else {
                console.log("tag creation aborted")
            }
        })


    });

const createTag = (tag, pushTag) => exec(`git tag ${tag}`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }
    if (stderr) {
        console.error("stderr:", stderr);
    }
    console.log("tag created successfully")
    pushTag(tag)
})
const pushTag = (tag) => exec(`git push origin ${tag}`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
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
            choices: environment,
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
    console.log('Existing tags:', versions);
    return versions.length > 0 ? Math.max(...versions.map(tag => parseInt(tag.split('_').pop()))) + 1 : 1
}

const buildPartialTagName = (env, branch) => {
    return `${env}_${branch}`
}

const buildTag = (partialTagName, version) => {
    return `${partialTagName}_${version}`
}

init(pushTag, getDesiredEnvironment, buildPartialTagName, buildTag, getConfirmation, createTag)

