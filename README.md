# An introduction to GitHub Pages and how we will use it in WADD 

Hopefully you are all comfortable with using Git in MPIE. If not, now is the time to go do [this tutorial](https://github.com/UoY-IM-MPIE/mpie-git-tutorial). Once done, come back here! 

In WADD, we are going to be using GitHub for our practicals. Much like MPIE, each practical task and associated files will be available as separate repositories. As usual, you should copy the repository for the practical in your own GitHub account with the "use this template button". 

For WADD, we can edit our repository settings to be able to view our code as a website, a feature known as GitHub Pages. You can then edit, push and see your changes live. This tutorial will walk you through the steps to be able to do this. 

1. Click the "use this template" button and copy this repository to your own account. **Make sure you make the repository public. Git Pages does not work with private repositories unless you have GitHub Pro**
   - You can get GitHub pro by signing up for the GitHub education package using your York email acount. 
2. Go to the settings page:
   - ![Screenshot of Github top navbar, highlighting settings button](https://github.com/IM-WADD/GitPages-Tutorial/assets/5978932/9ba2e74b-8966-4be9-b476-e5eddedad795)
3. Go to the 'Pages' section:
   - ![Screenshot of settings menu, Pages menu item highlighted](https://github.com/IM-WADD/GitPages-Tutorial/assets/5978932/b364de3b-b56f-4651-ba78-43e75863428b)
4. Under 'Branch' select the main branch and click Save.
   - ![Screenshot of updating the main branch for GitPages](https://github.com/IM-WADD/GitPages-Tutorial/assets/5978932/37a4e5f5-463f-4789-987f-7e8f50b8aa74)
5. Your repository is now setup for Git Pages. However, we don't have anything to show on the website yet! The next step is to create an html page for your website.
6. Go back to the 'Code' page of your repository and create a new file.
   - ![Screenshot of adding a page to a GitHub repository](https://github.com/IM-WADD/GitPages-Tutorial/assets/5978932/21d73661-29a8-493f-8cc4-42107bfa0ea5)
7. Name your file index.html. 
8. Add this code to your index.html file. You can do this directly in the broswer by editing the file you have created.
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>YOUR TITLE HERE</title>
  </head>
  <body>
  </body>
</html>
```
9. Commit the changes
10. If you navigate back to the 'Pages' section in settings you should now be able to see a messsage saying your site is live. This usually takes the form: https://yourusername.github.io/repositoryName
   - ![Screenshot of the site is live annoucement on GitHub Pages](https://github.com/IM-WADD/GitPages-Tutorial/assets/5978932/c40f96fb-9edf-4067-89cb-20d0977113ab)
11. Click the 'Visit Site' button and you should see your website with the message "Hello WADD World!"
12. You will be need to do this for every repository that you create. There is no limit to the number of repositories that can be configured for Git Pages. Remember to push and commit changes. It may take a few seconds for Git Pages to update and show you the live version of your code. 




