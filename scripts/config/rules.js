var allRules = {
    'rules' : [
        {
            'type': 'mention',
            'name': 'mentions',
            'regex': {
                'pattern': /\B@([a-z0-9]+)/ig,
                'matchGroup': 1
            }
        },
        {
            'type': 'emoticon',
            'name': 'emoticons',
            'regex': {
                'pattern': /\((\w+)\)/ig,
                'matchGroup': 1
            }
        },
        {
            'type': 'link',
            'name': 'links',
            'regex': {
                'pattern': /((\bhttp|\bhttps)\:\/\/)[a-z0-9\-\.]+\.[a-z]{2,3}(\/\S*)?/ig,
                'matchGroup': 0
            },
            'fetchUrl': 'http://title-service.azurewebsites.net/links'
        }
    ]
};
