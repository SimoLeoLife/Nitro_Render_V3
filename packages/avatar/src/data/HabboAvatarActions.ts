const SNOWWAR_PREVENTS = '2,3,6,14,15,17,18,19,20,21,22,33,34,35,36,38,39,45,46,48,54,55,56,57,58,69,71,72,89,90,91,92,94,97,100,104,105,107,108,115,116,117,118,119,120,121,122,123,124,125,127,129,130,131,132,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,164,165,166,167,168,169,170,171,172,173,174,175,176'
    .split(',').map(id => `fx.${id}`).concat('dance');

export const HabboAvatarActions = {
    'actions': [
        {
            'id': 'Default',
            'state': 'std',
            'precedence': 1000,
            'main': true,
            'isDefault': true,
            'geometryType': 'vertical',
            'activePartSet': 'figure',
            'assetPartDefinition': 'std',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'Lay',
            'state': 'lay',
            'precedence': 900,
            'main': true,
            'geometryType': 'laying',
            'activePartSet': 'figure',
            'assetPartDefinition': 'lay',
            'prevents': ['sit', 'float', 'swim'],
            'animation': false
        },
        {
            'id': 'Float',
            'state': 'float',
            'precedence': 850,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'figure',
            'assetPartDefinition': 'std',
            'prevents': ['sit', 'lay'],
            'animation': false
        },
        {
            'id': 'Swim',
            'state': 'swim',
            'precedence': 820,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'figure',
            'assetPartDefinition': 'swm',
            'prevents': ['sit', 'lay'],
            'animation': true
        },
        {
            'id': 'Sit',
            'state': 'sit',
            'precedence': 800,
            'main': true,
            'geometryType': 'sitting',
            'activePartSet': 'figure',
            'assetPartDefinition': 'sit',
            'prevents': ['lay', 'float', 'swim'],
            'animation': false
        },
        {
            'id': 'Move',
            'state': 'mv',
            'precedence': 700,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'figure',
            'assetPartDefinition': 'wlk',
            'prevents': ['sit', 'lay'],
            'animation': true
        },
        {
            'id': 'Talk',
            'state': 'talk',
            'precedence': 600,
            'activePartSet': 'head',
            'assetPartDefinition': 'tlk',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Wave',
            'state': 'wave',
            'precedence': 500,
            'activePartSet': 'handRight',
            'assetPartDefinition': 'wav',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Blow',
            'state': 'blow',
            'precedence': 500,
            'activePartSet': 'handRight',
            'assetPartDefinition': 'blw',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Laugh',
            'state': 'laugh',
            'precedence': 500,
            'activePartSet': 'head',
            'assetPartDefinition': 'laugh',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Cry',
            'state': 'cry',
            'precedence': 500,
            'activePartSet': 'head',
            'assetPartDefinition': 'cry',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Idle',
            'state': 'idle',
            'precedence': 500,
            'activePartSet': 'head',
            'assetPartDefinition': 'idle',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Respect',
            'state': 'respect',
            'precedence': 500,
            'activePartSet': 'handLeft',
            'assetPartDefinition': 'respect',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Sign',
            'state': 'sign',
            'precedence': 400,
            'activePartSet': 'handLeft',
            'assetPartDefinition': 'sig',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Sleep',
            'state': 'sleep',
            'precedence': 300,
            'activePartSet': 'eye',
            'assetPartDefinition': 'eyb',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'Dance',
            'state': 'dance',
            'precedence': 500,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'figure',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': true,
            'preventHeadTurn': true,
            'types': [
                {
                    'id': 1,
                    'animated': true,
                    'prevents': [],
                    'preventHeadTurn': false
                },
                {
                    'id': 2,
                    'animated': true,
                    'prevents': ['wave', 'cri', 'usei'],
                    'preventHeadTurn': true
                },
                {
                    'id': 3,
                    'animated': true,
                    'prevents': ['wave', 'cri', 'usei'],
                    'preventHeadTurn': true
                },
                {
                    'id': 4,
                    'animated': true,
                    'prevents': ['wave', 'cri', 'usei'],
                    'preventHeadTurn': true
                }
            ]
        },
        {
            'id': 'CarryItem',
            'state': 'cri',
            'precedence': 500,
            'activePartSet': 'handRight',
            'assetPartDefinition': 'crr',
            'prevents': [],
            'animation': false,
            'params': [
                { 'id': 'default', 'value': '1' }
            ]
        },
        {
            'id': 'UseItem',
            'state': 'usei',
            'precedence': 500,
            'activePartSet': 'handRight',
            'assetPartDefinition': 'drk',
            'prevents': [],
            'animation': true,
            'params': [
                { 'id': 'default', 'value': '1' }
            ]
        },
        {
            'id': 'AvatarEffect',
            'state': 'fx',
            'precedence': 500,
            'activePartSet': 'figure',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': true,
            'startFromFrameZero': true
        },
        {
            'id': 'Vote',
            'state': 'vote',
            'precedence': 500,
            'activePartSet': 'handLeft',
            'assetPartDefinition': 'vote',
            'prevents': [],
            'animation': true
        },
        {
            'id': 'Typing',
            'state': 'typing',
            'precedence': 100,
            'activePartSet': 'handLeft',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'RideJump',
            'state': 'ridejump',
            'precedence': 500,
            'activePartSet': 'figure',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': true,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowBoardOllie',
            'state': 'sbollie',
            'precedence': 500,
            'activePartSet': 'figure',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': true,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowBoard360',
            'state': 'sb360',
            'precedence': 500,
            'activePartSet': 'figure',
            'assetPartDefinition': '',
            'prevents': [],
            'animation': true,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowWarRun',
            'state': 'swrun',
            'precedence': 104,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'snowwarrun',
            'assetPartDefinition': 'swrun',
            'prevents': SNOWWAR_PREVENTS,
            'animation': false
        },
        {
            'id': 'SnowWarDieFront',
            'state': 'swdiefront',
            'precedence': 105,
            'main': true,
            'geometryType': 'swhorizontal',
            'activePartSet': 'snowwardiefront',
            'assetPartDefinition': 'swdie',
            'prevents': SNOWWAR_PREVENTS,
            'animation': false,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowWarDieBack',
            'state': 'swdieback',
            'precedence': 106,
            'main': true,
            'geometryType': 'swhorizontal',
            'activePartSet': 'snowwardieback',
            'assetPartDefinition': 'swdie',
            'prevents': SNOWWAR_PREVENTS,
            'animation': false,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowWarPick',
            'state': 'swpick',
            'precedence': 107,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'snowwarpick',
            'assetPartDefinition': 'swpick',
            'prevents': SNOWWAR_PREVENTS,
            'animation': false,
            'startFromFrameZero': true
        },
        {
            'id': 'SnowWarThrow',
            'state': 'swthrow',
            'precedence': 108,
            'main': true,
            'geometryType': 'vertical',
            'activePartSet': 'snowwarthrow',
            'assetPartDefinition': 'swthrow',
            'prevents': SNOWWAR_PREVENTS,
            'animation': false,
            'startFromFrameZero': true
        },
        {
            'id': 'GestureSmile',
            'state': 'sml',
            'precedence': 200,
            'activePartSet': 'head',
            'assetPartDefinition': 'sml',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'GestureAggravated',
            'state': 'agr',
            'precedence': 200,
            'activePartSet': 'head',
            'assetPartDefinition': 'agr',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'GestureSurprised',
            'state': 'srp',
            'precedence': 200,
            'activePartSet': 'head',
            'assetPartDefinition': 'srp',
            'prevents': [],
            'animation': false
        },
        {
            'id': 'GestureSad',
            'state': 'sad',
            'precedence': 200,
            'activePartSet': 'head',
            'assetPartDefinition': 'sad',
            'prevents': [],
            'animation': false
        }
    ]
};
