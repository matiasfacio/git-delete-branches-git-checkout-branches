### git-delete-branches / git-checkout-branches

## git delete branches
(gdb.js) Display all git branches available and helps you to delete them easily with a checkbox.

It won't allow you to delete main or master branches.
The regex needs to be more tested so if you find an error, please let me know!
It is node file that uses **inquirer** package.


#### How to make files executable:

```chmod 755 gdb.js```

In order to use it, type: ./gdb.js in your terminal, or better add it to your path if you want it to execute in every directory.

In my case I added to .zshrc the following PATH:

```export PATH="$PATH:/usr/local/bin/git-delete-branches-git-checkout-branches/"```

Save the file and executed: source ~/.zshrc to source the new configuration

You can also add an alias to your .zshrc file to make it easier to execute the script. For example:

```alias gdb="node ~/path/to/gdb.js"```

Then you can execute it by typing gdb in your terminal, like this:


---

## git checkout branches 
(gcb.js) Allows you to checkout to an existing local branch using a list. Specially usefully if you want to avoid copying and pasting. 
When running the script, it will display all the local branches available and you can select by clicking 'Enter' the one you want to check out to.
