Ext.regModel('poi', {
	fields: [
	         {name: 'id',        type: 'int'},
	         {name: 'title', type: 'string'},
	         {name: 'type',       type: 'string'},
	         {name: 'like',   type: 'int'},
	         {name: 'text',   type: 'string'},
	         {name: 'image',   type: 'string'},
	         {name: 'lat',   type: 'float'},
	         {name: 'lng',    type: 'float'}
	         ]
});

var poiList = new Ext.data.Store({
		model: 'poi',
		proxy: {
			type: 'ajax',
			url : 'http://geopedia.hyperwerk.ch/backend/get_pois.php',
				reader: {
					type: 'json',
					root: 'poi'
				}
		}
});

var tpl = new Ext.XTemplate(
	    '<tpl for=".">',
	    	'<div class="overlay x-hidden {type}" id="{id}">',
	        '<h1>{title} <img src="fb_like.png" alt="like" style="border:none;"></h1>',
	        '<p style="font-size:16px;">{text}</p>',
	        '<img src="{image}" width="420" height="" alt="{title}">',
	        '</div>',
	    '</tpl>',
	    '<div class="x-clear"></div>'
	);

var overlays = new Ext.Panel({
    id:'overlays',
    layout:'fit',
    title:'Simple DataView',

    items: new Ext.DataView({
        store: poiList,
        tpl: tpl,
        autoHeight:true,
        multiSelect: true,
        itemSelector:'div.thumb-wrap',
        emptyText: 'No images to display',
        hidden : true
    })
});

var newForm = new Ext.form.FormPanel({
    items: [
        {
            xtype: 'textfield',
            name : 'first',
            label: 'Meine Idee / Mein Wunsch:'
        },
        {
            xtype: 'textfield',
            name : 'last',
            label: 'Ausführlicher Text: (optional)'
        },
        {
            xtype: 'urlfield',
            name : 'youtube',
            label: 'Youtube'
        },
        {
            xtype: 'urlfield',
            name : 'flickr',
            label: 'Flickr'
        },
        {
            xtype: 'button',
            name : 'submit',
            id: 'newForm-submit',
            text: 'senden'
        }
    ],
    url : 'backend/post_new_poi.php',
    layout: {
        type: 'vbox',
        align: 'left'
    }
});

Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function() {
	
	overlays.render(Ext.getBody());
	
	// The following is accomplished with the Google Map API
	var position = new google.maps.LatLng(47.5340664917865, 7.70484924316406),  //Sencha HQ


	trackingButton = Ext.create({
		xtype   : 'button',
		iconMask: true,
		iconCls : 'locate'
	} ),

	toolbar = new Ext.Toolbar({
		dock: 'bottom',
		xtype: 'toolbar',
		ui : 'light',
		defaults: {
		iconMask: true
	},
	items : [
	         {
	        	 position : new google.maps.LatLng(47.5876876, 7.5894122),
	        	 iconCls  : 'home',
	        	 handler : function(){
	        	 //disable tracking
	        	 //trackingButton.ownerCt.setActive(trackingButton, false);
	        	 mapdemo.map.panTo(this.position);
	         }
	         },{
	        	 xtype : 'segmentedbutton',
	        	 allowMultiple : true,
	        	 listeners : {
	        	 toggle : function(buttons, button, active){
	        	 if(button.iconCls == 'maps' ){
	        		 mapdemo.traffic[active ? 'show' : 'hide']();
	        	 }else if(button.iconCls == 'locate'){
	        		 mapdemo.geo[active ? 'resumeUpdates' : 'suspendUpdates']();
	        	 }
	         }
	         },
	         items : [
	                  trackingButton,
	                  {
	                	  iconMask: true,
	                	  iconCls: 'maps',
	                	  handler : show_iphone_postit
	                  }
	                  ]
	         }]
	});

	mapdemo = new Ext.Map({

		mapOptions : {
		center : new google.maps.LatLng(47.5340664917865, 7.70484924316406),
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		navigationControl: true,
		navigationControlOptions: {
		style: google.maps.NavigationControlStyle.DEFAULT
	}
	},

	plugins : [
	           new Ext.plugin.GMap.Tracker({
	        	   trackSuspended : true,   //suspend tracking initially
	        	   highAccuracy   : false,
	        	   marker : new google.maps.Marker({
	        		   position: new google.maps.LatLng(47.5340664917865, 7.70484924316406),
	        		   title : 'Ihre Position'
	        	   })
	           }),
	           new Ext.plugin.GMap.Traffic({ hidden : true })
	           ],

	           listeners : {
		maprender : function(comp, map){

		//Add new PostIt:
		google.maps.event.addListener(map, 'click', function(event) {
			var marker_hinzufuegen = new google.maps.Marker({
				
				position: event.latLng,
				title:"Neues Projekt",
				draggable: true,
				map : mapdemo.map
			});
			console.log(event);
			// To add the marker to the map, call setMap();
			marker_hinzufuegen.setMap(map);
			google.maps.event.addListener(marker_hinzufuegen, 'click', overlay_hinzufuegen);
			// zoom : 17, 
		});
	}

	}
	});
	
	poiList.load(function(records, operation, success) {
		poiList.each(function(poi) {
	    	var markerIcon = '';
		    if(poi.data.type == 'Project')
			{
				markerIcon = 'img/marker_projekt.png';
			}
			if(poi.data.type == 'Idea')
			{
				markerIcon = 'img/marker_idee.png';
			}
    		var marker = new google.maps.Marker({
                map: mapdemo.map,
                title : poi.data.title,
                icon : markerIcon,
                position: new google.maps.LatLng(poi.data.lat, poi.data.lng)
            });
	    	
	    	google.maps.event.addListener(marker, 'click', function (){ showOverlayById(poi.data.id); });
	    	});
	});
	
	
	new Ext.Panel({
		fullscreen: true,
		dockedItems: [toolbar],
		items: [mapdemo]
	});

}
});

function showOverlayById(id)
{
	var overlay = new Ext.Panel ({
		floating: true,
		modal: true,
		centered: true,
		width: Ext.is.Phone ? 500 : 500,
		height: Ext.is.Phone ? 500 : 500,
		styleHtmlContent: true,
		centered: true,
		contentEl : document.getElementById(id),
		scroll: 'vertical',
		cls: 'htmlcontent'
	});
	console.log(overlay);
	overlay.show();at
}


function overlay1() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 500 : 500,
				height: Ext.is.Phone ? 500 : 500,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'overlay1',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}

function overlay2() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 500 : 500,
				height: Ext.is.Phone ? 500 : 500,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'overlay2',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}

function overlay3() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 500 : 500,
				height: Ext.is.Phone ? 500 : 500,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'overlay3',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}

function overlay4() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: true,
		width: Ext.is.Phone ? 300 : 300,
				height: Ext.is.Phone ? 300 : 300,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'overlay_iphone',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}


function overlay_hinzufuegen() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 500 : 500,
				height: Ext.is.Phone ? 500 : 500,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						items: newForm,
						layout : 'fit',
						listeners: {
					        itemtap: {
					            element: 'el', //bind to the underlying el property on the panel
					            fn: function(dataview, index, el, e){ console.log(el); }
					        },
					        dblclick: {
					            element: 'body', //bind to the underlying body property on the panel
					            fn: function(){ console.log('dblclick body'); }
					        }
					    },
						cls: 'htmlcontent'
	});
	
	console.log(overlay);
	overlay.setCentered(true);
	overlay.show();	
}



function show_iphone_postit() {
	alert('tw');
	//marker_hinzufuegen.setMap(null);


	marker_new_post = new google.maps.Marker({
		position: new google.maps.LatLng(47.5876876, 7.5894122),
		title:"Neues Projekt",
		icon  : postit_dreilaender
	});


	// To add the marker to the map, call setMap();
	marker_new_post.setMap(mapdemo);
	//google.maps.event.addListener(marker_new_post, 'click', overlay_iphone);
	// zoom : 17, 

}

function close_overlay() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 500 : 500,
				height: Ext.is.Phone ? 500 : 500,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'idee_hinzugefuegt',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}

function thank_you() {
	var overlay = new Ext.Panel({
		floating: true,
		modal: true,
		centered: false,
		width: Ext.is.Phone ? 300 : 300,
				height: Ext.is.Phone ? 300 : 300,
						styleHtmlContent: true,
						// dockedItems: overlayTb,
						scroll: 'vertical',
						contentEl: 'thank_you',
						cls: 'htmlcontent'
	});

	overlay.setCentered(true);
	overlay.show();	
}


