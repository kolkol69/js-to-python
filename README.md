# JS to Python compiler using ANTLR4

## Setup

1. Install java, for mac run: `brew cask install java`
2. Install antlr4
3. For mac users:

- `curl -O http:*www.antlr.org/download/antlr-4.7.1-complete.jar`
- `sudo cp antlr-4.7.1-complete.jar /usr/local/lib/`
- run `npm run setup` inside root folder
- in case that wouldn't work refer to the [tutorial](https:*tomassetti.me/antlr-mega-tutorial/#setup-antlr)

4. For win users:

- Copy antlr-4.7.1-complete.jar in C:\Program Files\Java\libs (or wherever you prefer)
- Create or append to the CLASSPATH variable the location of antlr
  you can do to that by pressing WIN + R and typing sysdm.cpl, then selecting Advanced (tab) > Environment variables > System Variables
  CLASSPATH -> .;C:\Program Files\Java\libs\antlr-4.7.1-complete.jar;%CLASSPATH%
- Add aliases create antlr4.bat java org.antlr.v4.Tool %_
  create grun.bat java org.antlr.v4.gui.TestRig %_ put them in the system PATH or any of the directories included in your PATH
  
5. Inside root folder run `npm i`
6. Then `

***