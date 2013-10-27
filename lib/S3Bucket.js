

	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, type 			= require( "ee-types" )
		, arg 			= require( "ee-arguments" )
		, ResourcePool	= require( "ee-resource-pool" );


	var   Downloader 	= require( "./Downloader" )
		, Uploader 		= require( "./Uploader" ); 



	module.exports = new Class( {

		init: function( options ){
			if ( !type.string( options.key ) ) 		throw new Error( "missing the string property «key» on the options object!" ).setName( "MissingArgumentException" );
			if ( !type.string( options.secret ) ) 	throw new Error( "missing the string property «secret» on the options object!" ).setName( "MissingArgumentException" );
			if ( !type.string( options.bucket ) ) 	throw new Error( "missing the string property «bucket» on the options object!" ).setName( "MissingArgumentException" );

			this.credentials = {
				  key: 		options.key
				, secret: 	options.secret
				, bucket: 	options.bucket
			};

			// limits
			this.maxConcurrentDownloads = type.number( options.maxConcurrentDownloads ) ? options.maxConcurrentDownloads : 10;
			this.maxConcurrentUploads 	= type.number( options.maxConcurrentUploads ) ? options.maxConcurrentUploads : 10;

			// initialize pools
			this.initialize();
		}




		, download: function( path, callback ){
			this.downloadPool.get( function( err, downloader ){
				if ( err ) callback( err );
				else {
					// the freeResource function was added by the resourcepool and isnt 
					// part of the uploader class
					downloader.download( path, function( err, file, headers ){
						downloader.freeResource();
						callback( err, file, headers );
					}.bind( this ) );
				}
			}.bind( this ) );
		}





		, upload: function(){
			var callback 	= arg( arguments, "function", function(){} )
				, args 		= Array.prototype.slice.call( arguments, 0 ).filter( function( a ){ return !type.function( a ); } );

			this.uploadPool.get( function( err, uploader ){
				if ( err ) callback( err );
				else {
					// we extracted the original callback so we can add our own
					// thats we neded to free the resource afer the upload has finished
					// the freeResource function was added by the resourcepool and isnt 
					// part of the uploader class
					args.push( function( err ){
						uploader.freeResource();
						callback( err );
					} );

					uploader.upload.apply( uploader, args );
				}
			}.bind( this ) );
		}




		, initialize: function(){
			// dowloads
			this.downloadPool = new ResourcePool( {
				  max: 					this.maxConcurrentDownloads
				, maxWaitingRequests: 	100000
				, timeout: 				3600000 // 1h
				, idle: 				60000 // 10 min
				, prefetch: 			10 // don't wait with the creation of resources
			} );

			this.downloadPool.on( "resourceRequest", function( callback ){
				callback( new Downloader( {
					credentials: this.credentials
				} ) );
			}.bind( this ) );

			// uploads
			this.uploadPool = new ResourcePool( {
				  max: 					this.maxConcurrentUploads
				, maxWaitingRequests: 	100000
				, timeout: 				3600000 // 1h
				, idle: 				60000 // 10 min
				, prefetch: 			10 // don't wait with the creation of resources
			} );

			this.uploadPool.on( "resourceRequest", function( callback ){
				callback( new Uploader( {
					credentials: this.credentials
				} ) );
			}.bind( this ) );
		}
	} );