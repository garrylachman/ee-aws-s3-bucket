

	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, arg 			= require( "ee-arguments" )
		, request	 	= require( "request" );



	module.exports = new Class( {

		init: function( options ){
			this.credentials = options.credentials;
		}



		, upload: function(){
			var   path 			= arg( arguments, "string" )
				, data 			= arg( arguments, "buffer" )
				, contentType 	= arg( arguments, "string", null, 1 )
				, private 		= arg( arguments, "boolean", true )
				, headers 		= arg( arguments, "object", {} )
				, callback 		= arg( arguments, "function", function( err ){ if ( err ) throw new err; } );

			if ( !path ) callback( new Error( "missing the argument «path», it must be the first string variable passed to the uploader!" ).setName( "MissingArgumentException" ) );
			if ( !data ) callback( new Error( "missing the argument «data», you must pass a variable with the type «buffer» to the uploader!" ).setName( "MissingArgumentException" ) );
			if ( !contentType ) callback( new Error( "missing the argument «contentType», it must be the second string variable passed to the uploader!" ).setName( "MissingArgumentException" ) );

			// set some headers
			headers[ "Content-Type" ] = contentType;
			if( !headers.date ) headers.date = new Date().toUTCString();
			if ( !private ) headers[ "x-amz-acl" ] = "public-read";


			request( {
				  url:  		"https://" + this.credentials.bucket + ".s3.amazonaws.com" + path
				, method: 		"PUT"
				, aws: 			this.credentials
				, body: 		data
				, timeout: 		600000 // 10 minutes
				, headers: 		headers
			}, function( err, response, body ){
				if ( err ) job.callback( err );
				else {
					if ( response && response.statusCode === 200 ) callback();
					else callback( new Error( "Upload failed, status: " + response.statusCode ).setName( "UploadFailedException" ) );
				}
			}.bind( this ) );
		}
	} );