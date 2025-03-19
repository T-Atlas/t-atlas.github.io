---
permalink: /
title: "Junhong Lian Homepage"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---
## About Me {#about-me}

I am currently a second-year Master's student at the Institute of Computing Technology, Chinese Academy of Sciences (ICT, CAS), under the supervision of Prof. [Xiang Ao](https://aoxaustin.github.io/index.html) and co-supervised with Dr. Xinyu Liu. My research interests include natural language processing (NLP), personalized generation in large language models (LLMs), and applications of NLP in the financial domain.

<span style="color:green">If you have any questions regarding my work or are interested in collaborating with me, please contact me via email. </span>

## 🔥 Recent News {#news}

* **[2025-03]** Welcome to my website! I am currently a second-year Master's student at ICT, CAS.
* **[2025-01]** One paper "Panoramic Interests: Stylistic-Content Aware Personalized Headline Generation" is accepted by WWW2025.
* **[2023-09]** One paper "Fact-Preserved Personalized News Headline Generation" is accepted by ICDM2023.

<!-- This is the front page of a website that is powered by the [Academic Pages template](https://github.com/academicpages/academicpages.github.io) and hosted on GitHub pages. [GitHub pages](https://pages.github.com) is a free service in which websites are built and hosted from code and data stored in a GitHub repository, automatically updating when a new commit is made to the repository. This template was forked from the [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/) created by Michael Rose, and then extended to support the kinds of content that academics have: publications, talks, teaching, a portfolio, blog posts, and a dynamically-generated CV. You can fork [this template](https://github.com/academicpages/academicpages.github.io) right now, modify the configuration and markdown files, add your own PDFs and other content, and have your own site for free, with no ads!

A data-driven personal website
======
Like many other Jekyll-based GitHub Pages templates, Academic Pages makes you separate the website's content from its form. The content & metadata of your website are in structured markdown files, while various other files constitute the theme, specifying how to transform that content & metadata into HTML pages. You keep these various markdown (.md), YAML (.yml), HTML, and CSS files in a public GitHub repository. Each time you commit and push an update to the repository, the [GitHub pages](https://pages.github.com/) service creates static HTML pages based on these files, which are hosted on GitHub's servers free of charge.

Many of the features of dynamic content management systems (like Wordpress) can be achieved in this fashion, using a fraction of the computational resources and with far less vulnerability to hacking and DDoSing. You can also modify the theme to your heart's content without touching the content of your site. If you get to a point where you've broken something in Jekyll/HTML/CSS beyond repair, your markdown files describing your talks, publications, etc. are safe. You can rollback the changes or even delete the repository and start over - just be sure to save the markdown files! Finally, you can also write scripts that process the structured data on the site, such as [this one](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.ipynb) that analyzes metadata in pages about talks to display [a map of every location you've given a talk](https://academicpages.github.io/talkmap.html).

Getting started
======
1. Register a GitHub account if you don't have one and confirm your e-mail (required!)
1. Fork [this template](https://github.com/academicpages/academicpages.github.io) by clicking the "Use this template" button in the top right. 
1. Go to the repository's settings (rightmost item in the tabs that start with "Code", should be below "Unwatch"). Rename the repository "[your GitHub username].github.io", which will also be your website's URL.
1. Set site-wide configuration and create content & metadata (see below -- also see [this set of diffs](http://archive.is/3TPas) showing what files were changed to set up [an example site](https://getorg-testacct.github.io) for a user with the username "getorg-testacct")
1. Upload any files (like PDFs, .zip files, etc.) to the files/ directory. They will appear at https://[your GitHub username].github.io/files/example.pdf.  
1. Check status by going to the repository settings, in the "GitHub pages" section

Site-wide configuration
------
The main configuration file for the site is in the base directory in [_config.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_config.yml), which defines the content in the sidebars and other site-wide features. You will need to replace the default variables with ones about yourself and your site's github repository. The configuration file for the top menu is in [_data/navigation.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_data/navigation.yml). For example, if you don't have a portfolio or blog posts, you can remove those items from that navigation.yml file to remove them from the header. 

Create content & metadata
------
For site content, there is one markdown file for each type of content, which are stored in directories like _publications, _talks, _posts, _teaching, or _pages. For example, each talk is a markdown file in the [_talks directory](https://github.com/academicpages/academicpages.github.io/tree/master/_talks). At the top of each markdown file is structured data in YAML about the talk, which the theme will parse to do lots of cool stuff. The same structured data about a talk is used to generate the list of talks on the [Talks page](https://academicpages.github.io/talks), each [individual page](https://academicpages.github.io/talks/2012-03-01-talk-1) for specific talks, the talks section for the [CV page](https://academicpages.github.io/cv), and the [map of places you've given a talk](https://academicpages.github.io/talkmap.html) (if you run this [python file](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.py) or [Jupyter notebook](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.ipynb), which creates the HTML for the map based on the contents of the _talks directory).

**Markdown generator**

The repository includes [a set of Jupyter notebooks](https://github.com/academicpages/academicpages.github.io/tree/master/markdown_generator
) that converts a CSV containing structured data about talks or presentations into individual markdown files that will be properly formatted for the Academic Pages template. The sample CSVs in that directory are the ones I used to create my own personal website at stuartgeiger.com. My usual workflow is that I keep a spreadsheet of my publications and talks, then run the code in these notebooks to generate the markdown files, then commit and push them to the GitHub repository.

How to edit your site's GitHub repository
------
Many people use a git client to create files on their local computer and then push them to GitHub's servers. If you are not familiar with git, you can directly edit these configuration and markdown files directly in the github.com interface. Navigate to a file (like [this one](https://github.com/academicpages/academicpages.github.io/blob/master/_talks/2012-03-01-talk-1.md) and click the pencil icon in the top right of the content preview (to the right of the "Raw | Blame | History" buttons). You can delete a file by clicking the trashcan icon to the right of the pencil icon. You can also create new files or upload files by navigating to a directory and clicking the "Create new file" or "Upload files" buttons. 

Example: editing a markdown file for a talk
![Editing a markdown file for a talk](/images/editing-talk.png)

For more info
------
More info about configuring Academic Pages can be found in [the guide](https://academicpages.github.io/markdown/), the [growing wiki](https://github.com/academicpages/academicpages.github.io/wiki), and you can always [ask a question on GitHub](https://github.com/academicpages/academicpages.github.io/discussions). The [guides for the Minimal Mistakes theme](https://mmistakes.github.io/minimal-mistakes/docs/configuration/) (which this theme was forked from) might also be helpful. -->

<!-- 这是一个基于 [Academic Pages 模板](https://github.com/academicpages/academicpages.github.io) 构建并托管在 GitHub Pages 上的网站首页。[GitHub Pages](https://pages.github.com) 是一项免费服务，允许用户通过存储在 GitHub 仓库中的代码和数据构建和托管网站，并在仓库提交新更改时自动更新。该模板是从 Michael Rose 创建的 [Minimal Mistakes Jekyll 主题](https://mmistakes.github.io/minimal-mistakes/) 分叉而来，并进行了扩展，以支持学术相关内容：出版物、演讲、教学、作品集、博客文章以及动态生成的简历。您可以立即分叉 [此模板](https://github.com/academicpages/academicpages.github.io)，修改配置和 Markdown 文件，添加您自己的 PDF 和其他内容，并免费拥有自己的网站，且无广告！

### 数据驱动的个人网站
与许多其他基于 Jekyll 的 GitHub Pages 模板一样，Academic Pages 将网站内容与其形式分离。网站的内容和元数据存储在结构化的 Markdown 文件中，而其他文件则构成主题，指定如何将这些内容和元数据转换为 HTML 页面。您将这些 Markdown (.md)、YAML (.yml)、HTML 和 CSS 文件保存在一个公开的 GitHub 仓库中。每次提交并推送更新到仓库时，[GitHub Pages](https://pages.github.com/) 服务会基于这些文件生成静态 HTML 页面，并免费托管在 GitHub 的服务器上。

通过这种方式，可以以极少的计算资源实现动态内容管理系统（如 Wordpress）的许多功能，同时大大降低被黑客攻击和 DDoS 的风险。您还可以随意修改主题，而无需触及网站内容。如果您不小心破坏了 Jekyll/HTML/CSS 中的某些内容，描述您的演讲、出版物等的 Markdown 文件是安全的。您可以回滚更改，甚至删除仓库并重新开始——只需确保保存 Markdown 文件！此外，您还可以编写脚本来处理网站上的结构化数据，例如 [此脚本](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.ipynb)，它分析演讲页面的元数据以显示 [您演讲过的每个地点的地图](https://academicpages.github.io/talkmap.html)。

### 开始使用
1. 如果您还没有 GitHub 账户，请注册一个并确认您的电子邮件（必需！）
2. 点击右上角的“Use this template”按钮，分叉 [此模板](https://github.com/academicpages/academicpages.github.io)。
3. 进入仓库设置（最右侧的选项卡，位于“Code”下方，应该在“Unwatch”下方）。将仓库重命名为“[您的 GitHub 用户名].github.io”，这将是您网站的 URL。
4. 设置全站配置并创建内容和元数据（见下文——另见 [此组差异](http://archive.is/3TPas)，显示为用户名“getorg-testacct”的用户设置 [示例网站](https://getorg-testacct.github.io) 时更改的文件）。
5. 将任何文件（如 PDF、.zip 文件等）上传到 files/ 目录。它们将出现在 https://[您的 GitHub 用户名].github.io/files/example.pdf。
6. 进入仓库设置，在“GitHub pages”部分检查状态。

### 全站配置
网站的主配置文件位于根目录中的 [_config.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_config.yml)，它定义了侧边栏内容和其他全站功能。您需要用关于您自己和您的网站 GitHub 仓库的变量替换默认变量。顶部菜单的配置文件位于 [_data/navigation.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_data/navigation.yml)。例如，如果您没有作品集或博客文章，可以从 navigation.yml 文件中删除这些项以从标题中移除它们。

### 创建内容和元数据
对于网站内容，每种类型的内容都有一个 Markdown 文件，这些文件存储在 _publications、_talks、_posts、_teaching 或 _pages 等目录中。例如，每个演讲是 [_talks 目录](https://github.com/academicpages/academicpages.github.io/tree/master/_talks) 中的一个 Markdown 文件。每个 Markdown 文件的顶部是关于演讲的结构化 YAML 数据，主题将解析这些数据以完成许多酷炫的功能。相同的演讲结构化数据用于生成 [Talks 页面](https://academicpages.github.io/talks) 上的演讲列表、每个 [特定演讲的页面](https://academicpages.github.io/talks/2012-03-01-talk-1)、[CV 页面](https://academicpages.github.io/cv) 的演讲部分，以及 [您演讲地点的地图](https://academicpages.github.io/talkmap.html)（如果您运行此 [Python 文件](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.py) 或 [Jupyter 笔记本](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.ipynb)，它将基于 _talks 目录的内容生成地图的 HTML）。

**Markdown 生成器**

仓库包括 [一组 Jupyter 笔记本](https://github.com/academicpages/academicpages.github.io/tree/master/markdown_generator)，它们将包含演讲或演示文稿的结构化数据的 CSV 文件转换为适合 Academic Pages 模板的单个 Markdown 文件。该目录中的示例 CSV 是我用于创建我的个人网站 stuartgeiger.com 的 CSV。我通常的工作流程是，将我的出版物和演讲保存在电子表格中，然后运行这些笔记本中的代码生成 Markdown 文件，然后将它们提交并推送到 GitHub 仓库。

### 如何编辑您网站的 GitHub 仓库
许多人使用 git 客户端在其本地计算机上创建文件，然后将它们推送到 GitHub 的服务器。如果您不熟悉 git，可以直接在 github.com 界面中编辑这些配置和 Markdown 文件。导航到文件（如 [此文件](https://github.com/academicpages/academicpages.github.io/blob/master/_talks/2012-03-01-talk-1.md)），然后点击内容预览右上角的铅笔图标（“Raw | Blame | History”按钮的右侧）。您可以通过点击铅笔图标右侧的垃圾桶图标删除文件。您还可以通过导航到目录并点击“Create new file”或“Upload files”按钮来创建新文件或上传文件。

### 示例：编辑演讲的 Markdown 文件
![编辑演讲的 Markdown 文件](/images/editing-talk.png)

### 更多信息
有关配置 Academic Pages 的更多信息可以在 [指南](https://academicpages.github.io/markdown/)、[不断增长的 Wiki](https://github.com/academicpages/academicpages.github.io/wiki) 中找到，您也可以随时 [在 GitHub 上提问](https://github.com/academicpages/academicpages.github.io/discussions)。[Minimal Mistakes 主题的指南](https://mmistakes.github.io/minimal-mistakes/docs/configuration/)（此主题是从其分叉而来）也可能有所帮助。 -->