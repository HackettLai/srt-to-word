# srt-to-word

Welcome to the SRT to DOCX Converter, your easy-to-use tool for transforming subtitle files. Just upload your .srt files, Select the desired conversion option, and once you're happy, save it as a handy .docx Word document. Simplifying subtitles has never been easier!

#### Example Site

https://srt.hackettlai.com
***
## Features

- **Simple File Upload:** Easily upload your `.srt` subtitle files using the integrated file input option.
- **Auto Deduction:** Automatically removes line numbers and timestamp lines from the SRT file.
- **Conversion Options:** There are three conversion options available.
  - **Original Breaks:** Preserves original line breaks only.
  - **Break on Punct:** Break on Punct:</strong> Strips out original line breaks and add line breaks after punctuation marks for each dialogue.
  - **In Paragraphs:** Merges all dialogue and group them into paragraphs by adding line breaks after punctuation marks.
- **Scroll to First Line:** Automatically scroll to the first line of the converted text after each conversion.
- **Dialogues Summary:** Added a summary of the dialogue count at the beginning.
- **Punctuation Breaks:** Uses a regular expression `/("|\.{3}|\.|!|\?)[^\S\r\n]|(……|⋯⋯|。|！|？)(?![\n”"」』…⋯。！？]|$)/g` to add line breaks after punctuation marks automatically.
  > Note: This is an optional feature and can be turned off by the checkbox.
- **Save as Word Document:** Able to download the converted document in the `.docx` format for easy sharing and editing.
