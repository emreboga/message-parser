var allRules = {
    'rules' : [
        {
            'type': 'mention',
            'name': 'mentions',
            'regex': {
                'pattern': /@(\w+)/ig,
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
                'pattern': /((http|https)\:\/\/)?(www.)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/ig,
                'matchGroup': 0
            },
            'fetchUrl': 'http://title-service.azurewebsites.net/links'
        }
    ]
};
