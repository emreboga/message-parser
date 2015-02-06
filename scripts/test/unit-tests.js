// definitions for all unit tests to be executed
var unitTests = {
    'cases' : [
        {
            'name': 'mentions',
            'input': 'The quick brown @fox jumps over the lazy @dog',
            'expected': {
                'mentions': [
                    'fox',
                    'dog'
                ]
            }
        },
        {
            'name': 'emoticons',
            'input': 'Dance (dance), when you are broken open. Dance (gangnamstyle), if you have torn the bandage off. Dance (celeryman) in the middle of the fighting. Dance in your blood. Dance when you are perfectly free. (a quote from Rumi)',
            'expected': {
                'emoticons': [
                    'dance',
                    'gangnamstyle',
                    'celeryman'
                ]
            }
        },
        {
            'name': 'links',
            'input': 'http://atlassian.com some random text in between links http://www.atlassian.com https://atlassian.com https://www.atlassian.com/ some more random text at the end',
            'expected': {
                'links': [
                    {
                        'link': 'http://atlassian.com',
                        'title': '\nSoftware Development and Collaboration Tools | Atlassian\n'
                    },
                    {
                        'link': 'http://www.atlassian.com',
                        'title': '\nSoftware Development and Collaboration Tools | Atlassian\n'
                    },
                    {
                        'link': 'https://atlassian.com',
                        'title': '\nSoftware Development and Collaboration Tools | Atlassian\n'
                    },
                    {
                        'link': 'https://www.atlassian.com/',
                        'title': '\nSoftware Development and Collaboration Tools | Atlassian\n'
                    }
                ]
            }
        },
        {
            'name': 'all',
            'input': '@bob @john (success) such a cool feature; https://twitter.com/jdorfman/status/430511497475670016',
            'expected': {
                'mentions': [
                    'bob',
                    'john'
                ],
                'emoticons': [
                    'success'
                ],
                'links': [
                    {
                        'link': 'https://twitter.com/jdorfman/status/430511497475670016',
                        'title': 'Justin Dorfman on Twitter: &quot;nice @littlebigdetail from @HipChat (shows hex colors when pasted in chat). http://t.co/7cI6Gjy5pq&quot;'
                    }
                ]
            }
        },
        {
            'name': 'none',
            'input': 'foo@bar.com (with an empty space) () @ www.google google.com @:colon @;semicolon',
            'expected': {}
        }
    ]
};
