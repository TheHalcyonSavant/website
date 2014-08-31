The Halcyon Savant official website
-----------------------------------------------------
* [Client](Client)
* [Server](Server)

###Overview
This webapp represents the personal website of The Halcyon Savant. To install and run this app visit the two links above for instructions. When everything is set up and running you will see aqua background screen with a top image header, left side menu and right side contents. The links that reside on the left side are explained as follows:

####> Home
This is the entry page of the webapp. Here you can find general information about The Halcyon Savant. Here are enlisted all technologies (languages, frameworks, tools) used by this webapp. They're grouped in two sets of tables: front-end and back-end technologies.

####> Programming languages
Here you can find all my personal open source repositories. They are automatically taken from my GitHub account. For every programming language there can be one or more framework underneath, and every language or framework is associated with one or more projects.

####> Questions & Answers
This module represents a list (accordion) of all manually edited questions and their respective answers. Questions also can be tagged. You can use the topmost section to filter out Q&As by contained words or tags.  
*Note: This module is for private use - available only to the host.*

####> Repopulate Skills
The "Programming Languages" list is filled from your private database served by [Server](../Server) ASP.NET app. If you want your local DB to not be empty and be populated with the synchronized skills and projects from your GitHub profile, then you have to click this link. Every time you make changes to your personal repositories on GitHub you have to make sure they are synchronized with your local DB by clicking this link. Your ASP.NET server will delete the 3 SQL GH tables in the background and populate them again with the latest skills and projects.  
*Note: This module is for private use - available only to the host.*
