#!/bin/bash
curl \
	-X POST \
	-H "Content-Type: audio/ogg" \
     	-H "Transfer-Encoding: chunked" \
	-H "Authorization: Api-Key AQVNxJVXjCYrbXStgHspLdfjKUmDBrw3tP4kOz0-" \
	--data-binary @speech.ogg \
	"https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general" -v
