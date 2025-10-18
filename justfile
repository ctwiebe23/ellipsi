# generate documentation
doc:
	pandoc README.md -so doc/index.html -d readme -d pandoc.yml
	pandoc CHANGELOG.md -so doc/changelog/index.html -d readme -d pandoc.yml

# compile the typescript
build:
	tsc
