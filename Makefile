build:
	sam build

deploy:
	sam deploy --guided

invoke-process-order:
	sam local invoke BearbiteProcessOrderFunction --event events/event.secret.json
