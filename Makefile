SOURCE_DIRS ?= lib test
TEST_DIRS ?= test/unit
MOCHA ?= ./node_modules/.bin/mocha
MOCHA_OPTS ?= --recursive -t 10000 --require test/bootstrap/node.js
JSDOC ?= ./node_modules/.bin/jsdoc
ESLINT ?= ./node_modules/.bin/eslint

all: clean docs lint test

node_modules:
	npm install

clean-docs:
	rm -rf ./docs/

docs: node_modules clean-docs
	$(JSDOC) -r -d ./docs/ -a all -R README.md $(SOURCE_DIRS)

lint: node_modules
	$(ESLINT) .

test: node_modules
	NODE_ENV=test $(MOCHA) $(MOCHA_OPTS) $(TEST_DIRS)

clean: clean-docs

.PHONY: clean clean-docs docs lint test
