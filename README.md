# git-delete-branches / git-checkout-branches

Display all the git branches available and helps you to delete them with a checkbox using the space bar to select and then confirm with enter.
It won't allow you to delete main or master branches.
The regex needs to be more tested so if you find an error, please let me know!
It is node file that uses inquirer package.

Made the both files executable:

chmod 755 gdb.js
chmod 755 gcb.js

In order to use it, type: ./gdb.js in your terminal, or better add it to your path if you want it to execute in every directory.
In my case I add to .zshrc the following PATH:
export PATH="$PATH:/usr/local/bin/git-delete-branches-git-checkout-branches/"
Save the file and executed: source ~/.zshrc   to reload the new configuration

---

I just added another one: gcb.js (git checkout branches) that allows you to checkout to an existing branch using a list, and hitting enter to change to the selected branch. Specially usefull if you want to avoid copy pasting. So one might feel encourage to give better descriptions name to a branch.

In order to use it, type: ./gcb.js in your terminal, or better add it to your path if you want it to execute in every directory.
