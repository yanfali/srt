/*global define */
define(['views_nav', 'views_main'], function(nav, main) {
    'use strict';
    var lib = {
        'regions': {
            NavRegion: nav.NavRegion,
            MainRegion: main.MainRegion
        },
        'views': {
            NavBarView: nav.NavBarView,
            WorkAreaView: main.WorkAreaView
        }
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
