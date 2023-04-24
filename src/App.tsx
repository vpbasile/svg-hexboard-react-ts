//style
import './css/bootstrap.css';
import './css/color-dark.css';
import './css/shape-size.css';

// <> Import components
import ErrorBoundary from './helpers/ErrorBoundary';
import { hexagon } from './helpers/hexDefinitions';
import { hexOrientations, rolloverDirection } from './helpers/math-hex';
import { randomBounded } from './helpers/math';
import HexBoardSVG from './components/HexBoardSVG';
import { BranchObject, hexplicate } from './components/snowFlake';
import { centerHexagon, reflectAcrossAxis } from './helpers/hexFunctions';
import { useState } from 'react';

export default function App() {

  const [seedIndex, setSeedIndex] = useState<number>(2);
  const [childLength, setChildLength] = useState<number>(2);

  // Build the hex Roster
  let hexRoster: hexagon[] = [centerHexagon]
  // FIX need to refactor this function so it can be used in this module and also hexFunctions
  function mergeRoster(newHexes: hexagon[]): void { hexRoster = hexRoster.concat(newHexes); }
  // Temporary override of growChildren function
  function growChildren(parent: BranchObject): void {
    const childSeed = parent.roster[seedIndex];
    // const childLength = 10;
    const childDirection = 1;
    const newBranch = new BranchObject(
      { seed: { q: childSeed.q, r: childSeed.r }, direction: childDirection, length: childLength }, parent.direction, "bg-ice");

    // if (childLength > 2) { growChildren(newBranch) }
    mergeRoster(newBranch.roster);
    // return aggregateRoster;
  }

  // FIX this should also be in hexFunctions
  // function growChildren(parent: BranchObject):void {
  //   const rando = randomBounded(1, (1 / 2) * parent.length);
  //   const childSeed = parent.roster[parent.roster.length - rando];
  //   const childLength = (parent.length - rando)/2;
  //   const parentDirection = parent.direction
  //   const childDeflection = randomBounded(1, 2);
  //   const childDirection = rolloverDirection(parentDirection - childDeflection);
  //   const newBranch = new BranchObject(
  //     { seed: { q: childSeed.q, r: childSeed.r }, direction: childDirection, length: childLength },parent.direction, "bg-ice");

  //   if (childLength > 2) { growChildren(newBranch) }
  //   mergeRoster(newBranch.roster);
  //   // return aggregateRoster;
  // }

  // !!! Create snowflake roster
  const mainBranch = new BranchObject({ seed: { q: 0, r: 0 }, direction: 0, length: 30 }, null, "bg-ice");
  mergeRoster(mainBranch.roster);

  growChildren(mainBranch)
  const fullSnowflake = hexplicate(hexRoster);

  mergeRoster(fullSnowflake)
  fullSnowflake.forEach((hexagon) => { mergeRoster([reflectAcrossAxis(hexagon, "q", "bg-ice")]) })


  // Define the canvs
  const canvasDimension = 1100

  function calcSizes(seedIndex:number,parent:hexagon[]){
    if(seedIndex>(parent.length)){seedIndex=parent.length-1}
    if(seedIndex<1){seedIndex=1}
    setSeedIndex(seedIndex);
    setChildLength(randomBounded(1,seedIndex));
  }

  return (
    <div className="App container-fluid bg-black text-light p-4">
      <div>
        <input type='number' value={seedIndex} onChange={e => { calcSizes(+(e.target.value),mainBranch.roster); }} />
        {/* Child length must be less than or equal to seedIndex */}

      </div>
      <div className="row" id="page-content-row">
        <ErrorBoundary>
          <HexBoardSVG gameGlobals={{
            orientation: hexOrientations['flat-top'],
            hexRadius: 8,
            separationMultiplier: 1.02,
            textSize: 0,
            drawBackBoard: false,
            onClick: function (): {} {
              throw new Error('Function not implemented.');
            },
          }} canvasGlobals={{
            canvasWidth: canvasDimension,
            canvasHeight: canvasDimension,
            hexGridOrigin: {
              x: canvasDimension / 2,
              y: canvasDimension / 2
            },
            canvasBackgroundColor: '000'
          }} hexRoster={hexRoster}

          />
        </ErrorBoundary>
      </div>
      <div className="row" id="header">
        <div className="col-12 text-ice">
          <a href='https://www.redblobgames.com/grids/hexagons/'>Special thanks to Red Blob Games!</a>
        </div>
      </div>
    </div>
  )

}