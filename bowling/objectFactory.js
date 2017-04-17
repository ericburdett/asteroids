/**********************************************************
* This function creates the lane, loads the texture onto
* the geometry.
***********************************************************/
function createLane(length, height, width, x, y, z) {
  //Loader for Lane
  var loader = new THREE.TextureLoader();

  //Load the Lane texture
  var lane_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ map: loader.load( 'pictures/woodFloor.jpg' )})
  );
  lane_material.map.wrapS = lane_material.map.wrapT = THREE.RepeatWrapping;
  lane_material.map.repeat.set( 5, 5 );

  var lane = new Physijs.BoxMesh(
    new THREE.BoxGeometry(length, height, width),
    lane_material,
    0,
    { restitution: .2, friction: .8 }
  );

  lane.position.x = x;
  lane.position.y = y;
  lane.position.z = z;

  lane.rotation.y = Math.PI/2;
  lane.receiveShadow = true;

  return lane;
}

/*************************************************************
* This function contains all the shapes for creating a gutter.
* This should be used to separate two lanes. It is not just
* a gutter for one lane.
**************************************************************/
function createGutter(startX,startY,startZ,scaleFactor, scene) {
  //Middle Gutter
  var mGeo = new THREE.BoxGeometry(3, 3.5, 400);
  var mMat = new THREE.MeshLambertMaterial({color:0x462712});
  var mGut = new Physijs.BoxMesh(mGeo,mMat,0);
  mGut.position.x = startX;
  mGut.position.y = startY + 2;
  mGut.position.z = startZ;

  //Bottom Gutter
  var bGeo = new THREE.BoxGeometry(20,1,400);
  var bMat = new THREE.MeshLambertMaterial({color:0x876E5A});
  var bGut = new Physijs.BoxMesh(bGeo,bMat,0);
  bGut.position.x = startX;
  bGut.position.y = startY - 2;
  bGut.position.z = startZ;

  //Side Right Gutter
  var srGeo = new THREE.BoxGeometry(.1,4,400);
  var srMat = new THREE.MeshLambertMaterial({color:0x876E5A});
  var srGut = new Physijs.BoxMesh(srGeo,srMat,0);
  srGut.position.x = startX + 10;
  srGut.position.y = -2;

  //Side Right Gutter Back
  var srbGeo = new THREE.BoxGeometry(3,30,45);
  var srbMat = new THREE.MeshLambertMaterial({color:0x462712});
  var srbGut = new Physijs.BoxMesh(srbGeo,srbMat,0);
  srbGut.position.x = startX;
  srbGut.position.y = startY + 15;
  srbGut.position.z = startZ - 182.5;

  //Side Left Gutter
  var slGeo = new THREE.BoxGeometry(.1,4,400);
  var slMat = new THREE.MeshLambertMaterial({color:0x876E5A});
  var slGut = new Physijs.BoxMesh(slGeo,slMat,0);
  slGut.position.x = startX - 10;
  slGut.position.y = -2;

  //Add Objects to the Scene
  scene.add(mGut);
  scene.add(bGut);
  scene.add(srGut);
  scene.add(srbGut);
  scene.add(slGut);
}

/************************************************************************
* This function creates the ball and loads the Texture onto the geometry
*************************************************************************/
function createBall(radius) {
  var loader = new THREE.TextureLoader();

  var ball_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({map: loader.load('pictures/ballTexture.png')})
  );

  var ball = new Physijs.SphereMesh(new THREE.SphereGeometry( radius, 32 ),ball_material);
  return ball;
}

/***************************************************************
* This method creates the pin and adds it to the scene. The scene
* needs to be passed in because the json model is loaded
* asynchronously.
****************************************************************/
function createPin(x,y,z, scaleFactor,scene,physics,index) {
  console.log("In createPin");
  var realPin;
  var oLoader = new THREE.JSONLoader();
   oLoader.load( 'models/bowling-pin.json', function ( geometry, material ) {
    if (physics) {
      realPin = new Physijs.CylinderMesh(geometry,
        Physijs.createMaterial(new THREE.MultiMaterial(material), {restitution:5, friction: 50}))
    }
    else {
      realPin = new THREE.Mesh(geometry, new THREE.MultiMaterial(material));
    }
    realPin.position.set(x,y,z);
    realPin.scale.set(scaleFactor,scaleFactor,scaleFactor);
    realPin.translation = THREE.GeometryUtils.center(geometry);
    scene.add(realPin);
    if (index != undefined) {
      pinsArray[index] = realPin;
    }
  });
}

/******************************************************
* Create the backdrop, add it to the scene.
*******************************************************/
function createBackdrop(x,y,z,scene) {

  var loader = new THREE.TextureLoader();
  var backdrop_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({map: loader.load('pictures/retroTexture2.jpg')})
  );

  var backdrop = new Physijs.BoxMesh(new THREE.BoxGeometry(565,150,40), backdrop_material,0)
  backdrop.position.x = x;
  backdrop.position.y = y + 30;
  backdrop.position.z = z;

  var backPlaneGeo = new THREE.BoxGeometry(565,35,2);
  var backPlaneMat = new THREE.MeshLambertMaterial({color:0x876E5A});
  var backPlane = new Physijs.BoxMesh(backPlaneGeo,backPlaneMat,0);

  backPlane.position.z = z - 28;
  backPlane.position.y = y - 50;

  var bottomPlaneGeo = new THREE.BoxGeometry(565,40,2);
  var bottomPlaneMat = new THREE.MeshLambertMaterial({color:0x876E5A});
  var bottomPlane = new Physijs.BoxMesh(bottomPlaneGeo,bottomPlaneMat,0);

  bottomPlane.position.z = z - 41;
  bottomPlane.position.y = y - 67.5;
  bottomPlane.position.x = x;
  bottomPlane.rotation.x = Math.PI/2;

  scene.add(bottomPlane);
  scene.add(backPlane);
  scene.add(backdrop);
}

/*****************************************************
* If bool is true, it will set the object to scoreText
* if bool is false, it will set the object to speedText
******************************************************/
function createText(theText,x,y,z,scene,newSize,newHeight,isScoreText,isScoreTotalText,isSpeedText) {
  var fontLoader = new THREE.FontLoader();
  fontLoader.load("Harabara_Regular.json", function(myFont) {
    var textGeo = new THREE.TextGeometry(theText, {
      size: newSize,
      height: newHeight,
      curveSegments: 6,
      font: myFont
    });
    var textMat = new THREE.MeshPhongMaterial({color:0xffffff});
    var text = new THREE.Mesh(textGeo,textMat);
    text.position.set(x,y,z);

    //Add a reference to the object based on the passed parameters
    if (isSpeedText) {
      speedText = text;
      text.name = 'speed';
      scene.add(text);
    }
    else if (isScoreText && isScoreTotalText) {
      messageText = text;
      text.name = 'message';
      scene.add(text)
    }
    else if (isScoreText) {
      scoreText = text;
      scene.add(text);
    }
    else if (isScoreTotalText) {
      textTotalScores.push(text);
      scene.add(text);
    }
    else {
      scoreGroup.add(text);
    }
  });
}

/************************************************************
* This will create the Box Structure of the score card
*************************************************************/
function createScorecard(x,y,z,scene) {
  var topGeo = new THREE.BoxGeometry(315,1,5);
  var topMat = new THREE.MeshPhongMaterial({color:0xffffff});
  var top = new THREE.Mesh(topGeo,topMat);
  top.position.set(x+7.5,y+15,z);
  scoreGroup.add(top);

  var bottomGeo = new THREE.BoxGeometry(315,1,5);
  var bottomMat = new THREE.MeshPhongMaterial({color:0xffffff});
  var bottom = new THREE.Mesh(bottomGeo, bottomMat);
  bottom.position.set(x+7.5,y-15,z);
  scoreGroup.add(bottom);

  //Frame Numbers
  for (var i = 1; i <= 10; i++) {
    if (i != 10)
      createText(i,x - 167 + (i *30),y + 18,z,scene,7,3,false,false,false);
    else
      createText(i,x - 162 + (i * 30),y + 18,z,scene,7,3,false,false,false)
  }

  //For loop to create the ScoreCard Frame
  for(var i = 0; i < 6; i++) {
    var midGeo = new THREE.BoxGeometry(1,30,5);
    var midMat = new THREE.MeshPhongMaterial({color:0xffffff});
    var mid = new THREE.Mesh(midGeo,midMat);
    if (i != 5)
      mid.position.set(x + (i * 30),y,z);
    else
      mid.position.set(x + (i * 30) + 15,y,z);

    scoreGroup.add(mid);

    var leftBoxGeo = new THREE.BoxGeometry(1,15,5);
    var leftBoxMat = new THREE.MeshPhongMaterial({color:0xffffff});
    var leftBox = new THREE.Mesh(leftBoxGeo,leftBoxMat);
    leftBox.position.set(x + (i * 30) - 15,y+7.5,z);
    scoreGroup.add(leftBox);

    var bottomBoxGeo = new THREE.BoxGeometry(15,1,5);
    var bottomBoxMat = new THREE.MeshPhongMaterial({color:0xffffff});
    var bottomBox = new THREE.Mesh(leftBoxGeo,leftBoxMat);
    bottomBox.position.set(x + (i * 30) - 7.5,y,z);
    bottomBox.rotation.z = Math.PI /2;
    scoreGroup.add(bottomBox);

    if (i == 5) {
      var secondLeftBox = new THREE.Mesh(leftBoxGeo,leftBoxMat);
      secondLeftBox.position.set(x + (i*30),y+7.5,z);
      var secondBottomBox = new THREE.Mesh(bottomBoxGeo,bottomBoxMat);
      secondBottomBox.position.set(x + (i*30) + 7.5,y,z);
      scoreGroup.add(secondLeftBox);
      scoreGroup.add(secondBottomBox);
    }

    if (i != 0) {
      var midGeo2 = new THREE.BoxGeometry(1,30,5);
      var midMat2 = new THREE.MeshPhongMaterial({color:0xffffff});
      var mid2 = new THREE.Mesh(midGeo2,midMat2);
      mid2.position.set(x - (i * 30),y,z);
      scoreGroup.add(mid2);

      if (i != 5) {
        var leftBoxGeo2 = new THREE.BoxGeometry(1,15,5);
        var leftBoxMat2 = new THREE.MeshPhongMaterial({color:0xffffff});
        var leftBox2 = new THREE.Mesh(leftBoxGeo2,leftBoxMat2);
        leftBox2.position.set(x - (i * 30) - 15,y+7.5,z);
        scoreGroup.add(leftBox2);

        var bottomBoxGeo2 = new THREE.BoxGeometry(15,1,5);
        var bottomBoxMat2 = new THREE.MeshPhongMaterial({color:0xffffff});
        var bottomBox2 = new THREE.Mesh(bottomBoxGeo2,bottomBoxMat2);
        bottomBox2.position.set(x - (i * 30) - 7.5,y,z);
        bottomBox2.rotation.z = Math.PI;
        scoreGroup.add(bottomBox2);
      }
    }

    scene.add(scoreGroup);
  }
}
