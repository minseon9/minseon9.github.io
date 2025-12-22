---
layout		: single
title		: Office Open XML
summary		: 
date		: 2025-12-22 21:44:56 +0900
updated		: 2025-12-22 22:54:30 +0900
tags		: xlsx docx pptx
toc		: true
public		: true
parent		: 
latex		: false
resource	: 0BECF1E1-8B55-4959-8844-E74DAABD5101
author_profile 	:  false
classes		:  wide
---
<img src="/assets/images/office_open_xml/unzip_xlsx.png">

## Office Open XML(OOXML)
Office Open XML(OOXML) is a file format that packages XML-based data into a single compressed(zipped) one.  
The fact that it is compressed is a key characteristic of the OOXML format.  

Common OOXML file formats include .xlsx, .docx, and .pptx.

### Standardization
- [ECMA-376](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
- [ISO/IEC 29500](https://www.loc.gov/preservation/digital/formats/fdd/fdd000395.shtml)

## File Structure: unzip xlsx
An .xlsx file is a zip file, so you can unzip it for sure.


```shell
unzip test.xlsx -d extracted
```

```shell
extracted/
├── _rels/
│   └── .rels
├── docProps/
│   └── core.xml
├── [Content_Types].xml
└── xl/
    ├── _rels/
    │   └── workbook.xml.rels
    ├──  drawings/
    │   └── workbook.xml.rels
    ├─── theme/
    ├─── worksheets/
    ├── sharedStrings.xml
    ├── styles.xml
    ├── workbook.xml
    ...
```

The `xl/` directory contains the actual spreadsheet data.  
`_rels/`, `[Content_Types].xml`, and `docProps/` are required components defined by the OOXML standard.

- `_rels/`: describes relationships between files.  
- `[Content_Types].xml`: defines the MIME types for each files.  
- `docProps/`: stores document properties, such as creation time and metadata.

