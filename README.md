# bbctextav-segments
Hackday detecting segments in transcripts

A POC API that

* converts VTT to JSON
* processes that with NLP to find the entities
* use clustering to find where speech about those entities begins and ends
* return data that describes where each segment starts and ends
* end user can then build searchable navigable interfaces to AV content

This is a POC, you will need to restart every time you make a change.