


	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, project 		= require( "ee-project" )
		, fs 			= require( "fs" )
		, assert 		= require( "assert" );



	var   S3Bucket 	= require( "./" )
		, file1 	= fs.readFileSync( "./test/1.jpg" )
		, bucket 	= new S3Bucket( project.config || {
		      key:      ""
		    , secret:   ""
		    , bucket:   ""
		    , maxConcurrentUploads: 2
		} );


	bucket.upload( "/test/private/1a.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 a pushed" );
	} );

	bucket.upload( "/test/private/1b.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 b pushed" );
	} );

	bucket.upload( "/test/private/1c.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 c pushed" );
	} );

	bucket.upload( "/test/private/1d.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 d pushed" );
	} );

	bucket.upload( "/test/private/1e.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 e pushed" );
	} );

	bucket.upload( "/test/private/1f.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log.info( "file1 f pushed" );
	} );



	bucket.download( "/test/private/1f.jpg", function( err, file, headers ){
		if ( err ) log.trace( err );
		else {
			log( headers );
			fs.writeFile( "./test/downlaoded.jpg", file );
		}
	} );