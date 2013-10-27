# ee-aws-s3-bucket

rate limited up and file downloads for amazon s3

## installation

	npm install ee-aws-s3-bucket


## API
	

	// upload
	bucket.upload( "/path", "content type", { headers: object }, function callback( err ){}, private );

	// download
	bucket.download( "/path", function callback( err, data, headers ){} );


## usage
	
	var   S3Bucket 	= require( "ee-aws-s3-bucket" )
		, file1 	= fs.readFileSync( "./test/1.jpg" )
		, bucket 	= new S3Bucket( project.config || {
		      key:      ""
		    , secret:   ""
		    , bucket:   ""
		    , maxConcurrentUploads: 2
		    , maxConcurrentDownloads: 2
		} );


	// actual upload sample
	bucket.upload( "/test/private/1a.jpg", "Image/Jpeg", file1, true, function( err ){
		if ( err ) log.trace( err );
		else log( "file1 a pushed" );
	} );

	// actual download sample
	bucket.download( "/test/private/1f.jpg", function( err, file, headers ){
		if ( err ) log.trace( err );
		else {
			log( headers );
			fs.writeFile( "./test/downlaoded.jpg", file );
		}
	} );