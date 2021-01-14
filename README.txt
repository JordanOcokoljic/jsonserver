jsonserver
===========

jsonserver is a very bare bones json server. It requires no external
dependencies. It is configured via a json file. This file will map paths to
json responses.

Here is an example configuration:

{
    "/names": ["luke", "lucy", "aaron", "ashley"],
    "/subjects": ["science", "math", "english", "geography"]
}

This will mean sending a request such as:

GET /names HTTP/1.1

Will return a json string like this:

["luke","lucy","aaron","ashley"]
