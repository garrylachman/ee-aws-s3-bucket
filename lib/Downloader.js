

	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, request	 	= require( "request" );



	module.exports = new Class( {

		init: function( options ){
			this.credentials = options.credentials;
		}



		, download: function( path, callback ){
			request( {
				  url:  		"https://" + this.credentials.bucket + ".s3.amazonaws.com" + path
				, method: 		"GET"
				, aws: 			this.credentials
				, encoding: 	null
				, timeout: 		60000 // 60 secs
			}, function( err, response, body ){
				if ( err ) callback ( err );
				else {
					if ( response && response.statusCode === 200 ) callback( null, body, response.headers );
					else callback( new Error( "Download failed, status: "+response.statusCode ).setName( "DownloadFailedException" ) );
				}
			}.bind( this ) );
		}
	} );