# Contributing to Cloudinary React Native library

Contributions are welcome and greatly appreciated!

## Reporting a bug

- Make sure that the bug was not already reported by searching in GitHub under [Issues](https://github.com/cloudinary/cloudinary-react-native) and the Cloudinary [Support forms](https://support.cloudinary.com).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/cloudinary/cloudinary-react-native/issues/new).
  Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.
- If you need help using `cloudinary-react-native` please [submit a request](https://support.cloudinary.com/hc/en-us/requests/new) on Cloudinary's site.

## Requesting a feature

We would love to receive your requests!
Please be aware that the library is used in a wide variety of environments and that some features may not be applicable to all users.

- Open a GitHub [issue](https://github.com/cloudinary/cloudinary-react-native) describing the benefits (and possible drawbacks) of the requested feature.

## Fixing a bug / Implementing a new feature

- Follow the instructions detailed in [Code contribution](#code-contribution).
- Open a new GitHub pull request.
- Ensure the PR description clearly describes the bug / feature. Include relevant issue number if applicable.
- Provide test code that covers the new code.

## Code contribution

When contributing code, either to fix a bug or to implement a new feature, please follow these guidelines:

#### Fork the project

Fork the project on [GitHub](https://github.com/cloudinary/cloudinary-react-native) and check your copy.

#### Create a topic branch

Make sure your fork is up-to-date and create a topic branch for your feature or bug fix.

```
git checkout master
git pull upstream master
git checkout -b my-feature-branch
```
#### Rebase

If you've been working on a change for a while, rebase with upstream/master.

```
git fetch upstream
git rebase upstream/master
git push origin my-feature-branch -f
```


#### Write tests

Try to write a test that reproduces the problem you're trying to fix or describes a feature you would like to build.

We definitely appreciate pull requests that highlight or reproduce a problem, even without a fix.

#### Write code

Implement your feature or bug fix.
Follow the following React Native coding standards

#### Write Documentation

Document any external behavior in the [README](README.md).

#### Commit Changes

Make sure git knows your name and email address:

```
git config --global user.name "Your Name"
git config --global user.email "contributor@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why.

```
git add ...
git commit
```


> Please squash your commits into a single commit when appropriate. This simplifies future cherry picks and keeps the git log clean.

#### Push

```
git push origin my-feature-branch
```

#### Make a Pull Request

Go to https://github.com/cloudinary/cloudinary-react-native/compare and select your feature branch. Click the 'Create pull request' button and fill out the form. Pull requests are normally reviewed within a few days.
Ensure the PR description clearly describes the problem and solution. Include relevant issue number if applicable.

#### Rebase

If you've been working on a change for a while, rebase with upstream/master.

```
git fetch upstream
git rebase upstream/master
git push origin my-feature-branch -f
```

#### Check on your pull request

Go back to your pull request after a few minutes and see whether it passed muster with Travis-CI. Everything should look green. Otherwise, fix issues and amend your commit as described above.

#### Be patient

It's likely that your change won't merged and that the nitpicky moderators will ask you to do more, or to fix seemingly minor issues. Hang in there!

#### Thank you

Please do know that we really appreciate and value your time and work. We love you, really.