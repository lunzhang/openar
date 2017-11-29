module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "rules": {
        "no-mixed-operators": 0,
        "no-param-reassign": 0,
        "no-plusplus": [2, {"allowForLoopAfterthoughts": true}],
        "import/no-extraneous-dependencies": 0,
        "max-len": [2, {"code": 160}],
        "import/no-unresolved": 0,
        "import/extensions": 0,
        "default-case": 0,
        "space-infix-ops": ["error", {"int32Hint": false}],
        "indent": ["error", 4],
        "linebreak-style": 0,
    }
};
