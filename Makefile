.PHONY: cv cv-zh

cv:
	cp -f ./en/cv.json ./cv.json
	rm -f ./public/*.pdf
	cp -f ./en/*.pdf ./public/
	npm run build
	wrangler pages publish dist --project-name yu-cv

cv-zh:
	cp -f ./zh/cv.json ./cv.json
	rm -f ./public/*.pdf
	cp -f ./zh/*.pdf ./public/
	npm run build
	wrangler pages publish dist --project-name yu-cv-zh