 function Info(residue, name, index){
  	this.residue = residue;
  	this.name = name;
  	this.index = index;
  	this.turn = [];
 }

 document.addEventListener( "DOMContentLoaded", function(){
 	var connection = {
      "connect1": [
      ]
    };

    stage = new NGL.Stage( "viewport" );
    stage.loadFile( "rcsb://1CRN.cif", {
        defaultRepresentation: true,
        sele: "/0"
    } ).then( function( comp ){
 
    	comp.addRepresentation("label", {sele: ".CA"})
    	comp.addRepresentation("licorice", {sele: "backbone"})

        var s = comp.structure.getView( new NGL.Selection( "/0 and not #H" ) );     //only select the first module
        var apN = s.getAtomProxy();	//atom proxy nitrogen
        var apO = s.getAtomProxy();	//atom proxy oxygen

        // rp represents residue proxy
        s.eachResidue( function(rp) {                      
          residue = rp.clone();
          residueName = rp.resname;		//name of the current residue
          residueIndex = rp.resno		//index of the current residue from loading datas1
          connection.connect1.push( new Info(residue,residueName,residueIndex) );
        } );

        // console.log(connection.connect1.turn);
        for ( var i = 0; i < connection.connect1.length; i++){

        	if ( (i+5) < connection.connect1.length){
        		connection.connect1[i].turn.push(connection.connect1[i+3].name);
        		connection.connect1[i].turn.push(connection.connect1[i+4].name);
        		connection.connect1[i].turn.push(connection.connect1[i+5].name);

        		apO.index = connection.connect1[i].residue.getAtomIndexByName("O");
        		apN.index = (connection.connect1[i+3]).residue.getAtomIndexByName("N");
        		//removing any connection that has a distance greater than 3 within 3 atoms
        		if ( apO.distanceTo(apN) >=3 ){
        			connection.connect1[i].turn.splice(0,1);
        		}

        		//console.log(apO.qualifiedName(), apN.qualifiedName(), apO.distanceTo(apN), connection.connect1[i].turn.length)

        		apN.index = (connection.connect1[i+4]).residue.getAtomIndexByName("N");
        		//removing any connection that has a distance greater than 3 within 4 atoms
        		if ( apO.distanceTo(apN) >=3 ){
        			if ( connection.connect1[i].turn.length === 3){
        				connection.connect1[i].turn.splice(1,1);
        			}else{
        				connection.connect1[i].turn.splice(0,1);
        			}
        		}

        		apN.index = (connection.connect1[i+5]).residue.getAtomIndexByName("N");     		
        		//removing any connection that has a distance greater than 3 within 5 atoms
        		if ( apO.distanceTo(apN) >=3 ){
        			if ( connection.connect1[i].turn.length === 3){
        				connection.connect1[i].turn.splice(2,1);
        			}else if ( connection.connect1[i].turn.length === 1){
        				connection.connect1[i].turn.splice(0,1);
        			}else{
        				connection.connect1[i].turn.splice(1,1);
        			}
        		}
        	}
        }

        //double checking after removing any connections that are greater than 3 by using splice
		// for ( var i = 0; i < connection.connect1.length; i++){
		// 	if ( connection.connect1[i].turn.length !== 0 ){
		// 		console.log( connection.connect1[i].name, connection.connect1[i].turn);
		// 	} 
		// }
		
        console.log(connection)

        // get the data of each atom
        s.eachAtom( function( ap ){
          // tempV.copy( ap );
          // console.log(ap)
        } );

        s.eachBond( function( bp ){
          if( bp.atom1.element==="O" && bp.atom2.element==="N" ) {
            // console.log(bp.atom1, bp.atom2, bp.atom1.distanceTo(bp.atom2));
          }
         // console.log(bp.clone());
          
        
        });

      } );
  } );

