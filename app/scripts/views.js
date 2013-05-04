/*global define */
define(['views_nav', 'views_main', 'views_subtitle', 'views_playback'], function(nav, main, subtitle, player) {
    'use strict';
    var lib = {
        'regions': {
            NavRegion: nav.NavRegion,
            MainRegion: main.MainRegion,
            PlaybackRegion: player.PlaybackRegion
        },
        'views': {
            NavBarView: nav.NavBarView,
            WorkAreaView: main.WorkAreaView,
            SubtitleView: subtitle.SubtitleView,
            PlayerControlView: player.PlayerControlView,
            PlayerLayout: player.PlayerLayout,
            PlayerTimerView: player.PlayerTimerView
        }
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
