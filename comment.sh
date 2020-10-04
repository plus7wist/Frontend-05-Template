#! /usr/bin/env bash

GITHUB_NAME=plus7wist
UPSTREAM_NAME=GeekUniversity
GITHUB_REPO=Frontend-05-Template
GITHUB_TOKEN=

WEEK_NO=
ISSUE_NO=
DEBUG=0

is_debug() {
	if [ "$DEBUG" -eq 1 ]; then
		return 0
	fi
	return 1
}

show_help() {
	cat <<-EOF
	comment - comment on upstream
	
	-h           show this help and exit.
	-w WEEK_NO   current week number.
	-i ISSUE_NO  issue number of this week.
	EOF
}

main() {
	while getopts dhi:w: flag; do
		case "$flag" in
			d) DEBUG=1;;
			h) show_help; exit;;
			i) ISSUE_NO="$OPTARG";;
			w) WEEK_NO="$OPTARG";;
			?) fail "usage invalid flag";;
		esac
	done

	if [ "$WEEK_NO" = "" ]; then
		fail "need -w WEEK_NO"
	fi
	if [ "$ISSUE_NO" = "" ]; then
		fail "need -i ISSUE_NO"
	fi

	if [ ! -d "$(week_name)" ]; then
		fail "not found week $(week_name)"
	fi

	printf 'your token: '
	read -r GITHUB_TOKEN
	printf "\nuse token: '%s'\n" "$GITHUB_TOKEN"

	echo "body: '$(comment_body)'"
	while true; do
		comment_issue && break
		sleep 3
	done
}

fail() {
	printf 'error: %s\n' "$1"
	exit 1
}

week_name() {
	printf "week-%02d" "$WEEK_NO"
}

comment() {
	echo -n '#学号: G20200447050163\n'
	echo -n '#姓名: 张世权\n'
	echo -n '#班级: 5\n'
	echo -n '#小组: 5\n'
	echo -n "#作业&总结链接: https://github.com/$GITHUB_NAME/$GITHUB_REPO/tree/master/$(week_name)\n"
}

comment_body() {
	printf '{"body": "%s"}' "$(comment)"
}

comment_issue() {
	local curl_u="$GITHUB_NAME:$GITHUB_TOKEN"
	local curl_url="https://api.github.com/repos/$UPSTREAM_NAME/$GITHUB_REPO/issues/$WEEK_NO/comments"
	local curl_body="$(comment_body)"

	if is_debug; then
		echo "curl_u: $curl_u"
		echo "curl_url: $curl_url"
	else
		curl \
			-u "$curl_u" \
			-X POST \
			-H "Accept: application/vnd.github.v3+json" \
			-d "$curl_body" \
			"$curl_url"
	fi
}

main "$@"
