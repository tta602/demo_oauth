'use strict';

class AppConstants{
    static limitRequestMax = 5;
    static limitRequestSeconds = 90;

    static limitLockedMax = 5;
    static limitLockedSeconds = 86400; //1 day
}

module.exports = AppConstants;