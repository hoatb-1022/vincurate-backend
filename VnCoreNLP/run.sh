#java -Xmx2g -jar VnCoreNLP-1.1.1.jar -fin input.txt -fout output.txt
vncorenlp -Xmx2g VnCoreNLP-1.1.1.jar -p 9000 -a "wseg,pos,ner,parse"
