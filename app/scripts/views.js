/*global define */
define(['views_nav', 'views_main', 'views_subtitle'], function(nav, main, subtitle) {
    'use strict';
    var lib = {
        'regions': {
            NavRegion: nav.NavRegion,
            MainRegion: main.MainRegion
        },
        'views': {
            NavBarView: nav.NavBarView,
            WorkAreaView: main.WorkAreaView,
            SubtitleView: subtitle.SubtitleView
        }
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
