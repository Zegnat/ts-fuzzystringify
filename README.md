# Fuzzy Stringify

`@zegnat/fuzzystringify` is a library for fuzzing the JSON version of JavaScript objects. It is meant to be used for JSON APIs to ensure the API consumers do not grow to depend on a specific formatting.

## History

Back in 2017, [@abhayachauhan][] was working for [PageUp][] and released an extension for Newtonsoft Json.Net called PageUp.FuzzySerializer. Read more about this on (a Wayback Machine copy of) their blog: [Loosen coupling over APIs – The Fuzzy Serializer][].

[@abhayachauhan]: https://github.com/abhayachauhan
[PageUp]: https://www.pageuppeople.com/
[Loosen coupling over APIs – The Fuzzy Serializer]: http://web.archive.org/web/20210118215003/https://www.abhayachauhan.com/2017/10/fuzzy-serializer/

As of 2024, this fuzzy serialiser is still in use by PageUp and the blog post (although no longer live) is [still linked to on their Developer Portal](https://developers.pageuppeople.com/Api/Partners/BackgroundChecking#the-get-endpoint-fields-are-not-sequential-and-there-are-uuid-fields-that-are-not-documented-why) ([archived][]).

[archived]: https://web.archive.org/web/20240324120144/https://developers.pageuppeople.com/Api/Partners/BackgroundChecking#the-get-endpoint-fields-are-not-sequential-and-there-are-uuid-fields-that-are-not-documented-why

The idea is interesting, so in March 2024 this repository was created to see if the same effect could easily be implemented in JavaScript. The original GitHub repository (PageUpPeopleOrg/PageUp.FuzzySerializer) no longer exists, but an old fork was discovered: [stu-mck/PageUp.FuzzySerializer](https://github.com/stu-mck/PageUp.FuzzySerializer). This made it possible to port over the tests and start developing a fuzzer from scratch.
