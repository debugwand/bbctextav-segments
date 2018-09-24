# bbctextav-segments
Hackday detecting segments in transcripts

A POC API that

* converts VTT to JSON
* processes that with NLP to find the entities
* use clustering to find where speech about those entities begins and ends
* return data that describes where each segment starts and ends
* end user can then build searchable navigable interfaces to AV content

This is a POC, you will need to restart every time you make a change.

You will need to set up an IBM account, IBM bluemix account, and set up a Natural Language Understanding service where you will get service credentials

You will need a .env file with the following items:
WATSON_USR
WATSON_PWD

https://console.bluemix.net/docs/services/watson/getting-started-sdks.html#sdks