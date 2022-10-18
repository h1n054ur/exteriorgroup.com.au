require2( ['/cms/map/advanced-map/results.js'], function () {
	var els = USC.getElementsCollectionByDataAttribute( '[data-advmap]' );
	var settings = USC.elementData( els.mapWithSearch ).settings;
    var advmap_options = {
        gmapOptions: {
            map: {
		        gestureHandling: 'greedy',
		        minZoom: 3,	
	        }
        }
    };
    if ( window.google_map_styles ) {
        advmap_options.gmapOptions.map.styles = window.google_map_styles;
    }
	var controls = {
		results: new ADVMap.results( els.results )
	};
	if ( settings.useSearchAlongRoute ) {
		// Set up directions.
		require2( '/cms/map/advanced-map/directions.js', function ( $ ) {
			controls.directions = new ADVMap.directions( els.main, settings );
			controls.directions.setMap( els.imap );
			subscriptions.push(
				controls.directions
					.subscriber
					.subscribe( 'directions', function ( success ) {
						if ( success ) {
							advmap.getState().feedback = ADVMap.FEEDBACK_TYPES.DIRECTIONS_FOUND;
						} else {
							advmap.getState().feedback = ADVMap.FEEDBACK_TYPES.DIRECTIONS_ERROR;
						}
						controls.results.feedback( advmap.getState() );
					} )
			);
		} );
	}
	/**
	 * Advanced map manager.
	 */
	var advmap = ADVMap.create( "LocationsArea", advmap_options );
	/**
	 * Array of subscriptions
	 * @type any[]
	 */
    var subscriptions = [];
	subscriptions.push(
		// General state change.
		ADVMap.subscribe( 'state', function ( state ) {
			// Generate the locations list. 
			controls.results.render( state );
			// Set up feedback state.
			controls.results.feedback( state );
		}, true ),
		// Active state,
		ADVMap.subscribe( 'active-state', function ( state ) {
			if ( state.activeMarker ) {
				advmap.panToMarker( state.activeMarker );
			}
			controls.results.activate( state );
		}, true ),
		ADVMap.subscribe( 'locations', function ( state ) {
			controls.results.render( state );
			controls.results.activate( state );
		} ),
		ADVMap.subscribe( 'markers-in-view', function ( state ) {
			controls.results.activate( state );
		}, true ),
		ADVMap.subscribe( 'feedback', function ( state ) {
			controls.results.feedback( state );
		} ),
		ADVMap.subscribe( 'reset-map', function ( state ) {
			// Generate the locations list. 
			controls.results.render( state );
			// Set up feedback state.
			controls.results.feedback( state );

			if ( controls.directions ) {
				controls.directions.reset();
			}
		} )
	);

    /**
     * Main click event listener.
     */
	els.main.addEventListener( 'click', function ( e ) {
		var data = USC.linkData( e );
		switch ( data.action && data.action.toLowerCase() ) {
			case 'geolocate':
				advmap.geolocate( e );
				return;
            case 'zipsearch':
                advmap.search();
				return;
            case 'resetmap':
				advmap.resetMap();
				if ( controls.directions ) {
					controls.directions.reset();
				}
				return;
            case 'noactivestates':
                advmap.noActiveStates();
				return;
			case 'directions':
				controls.directions.getDirections();
				return;
			default:
				break;
		}

        var loc = e.target.closest( "li[data-advmap]" );
        switch ( loc && loc.getAttribute( 'data-advmap' ).toLowerCase() ) {
            case 'location':
            case 'clusterlocation':
                var id = loc.getAttribute( 'data-key' );
                advmap.setActive( +( id ) );
                break;
            default:
                break;
        }
	} );

    /**
     * Main click event listener.
     */
	els.main.addEventListener( 'keydown', function ( e ) {
		var key = USC.getKey( e );
        switch ( key ) {
			case 'ENTER':
			case 'NUMPADENTER':
				if ( e.target === els.zipSearch ) {
					advmap.search();
				} else if ( e.target === els.startLocation || e.target === els.endLocation ) {
					controls.directions.getDirections();
				}
				break;
            default:
                return;
        }
	} );

	/**
	 * Main change event listener.
	 */
	els.main.addEventListener( 'change', function ( e ) {
		var target = e.target;
		var filter = target.getAttribute( 'data-advmap' ) === 'filter';
		if ( filter ) {
			advmap.handleFilter( target );
		}
	} );

	/**
	 * Unsubscribe before unloading the page.
	 */
	window.addEventListener( 'beforeunload', function () {
		for ( var i = 0; i < subscriptions.length; i++ ) {
			var sub = subscriptions[i];
			sub.unsubscribe();
		}
		subscriptions.length === 0;
	} );

    if ( window.register ) {
		window.register( '/cms/map/advanced-map/advanced-map.js' );
	}
} );