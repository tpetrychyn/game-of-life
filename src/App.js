import React from 'react';
import './App.css';

const statusEnum = {
  DEAD: 0,
  ALIVE: 1
}

class Tile extends React.Component {
  constructor() {
    super()
    this.state = {
      backgroundColor: null
    }
  }

  onMouseEnter() {
    this.setState({backgroundColor: 'yellow'})
  }

  onMouseLeave() {
    this.setState({backgroundColor: null})
  }

  getBackgroundColor() {
    const { backgroundColor } = this.state
    const { status } = this.props
    if (backgroundColor !== null) {
      return backgroundColor
    } else if (status === statusEnum.ALIVE) {
      return 'black'
    }

    return null
  }

  render() {
    const bg = this.getBackgroundColor()
    return <div 
      onMouseEnter={this.onMouseEnter.bind(this)} 
      onMouseLeave={this.onMouseLeave.bind(this)}
      className='tile' 
      style={{backgroundColor: bg}}></div>
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      world: []
    }
  }

  componentDidMount() {
    const [rows, cols] = [30, 30]
    let world = []
    for (let x=0;x<rows;x++) {
      let tiles = []
      for (let y=0;y<cols;y++) {
        let s = statusEnum.DEAD
        if (Math.floor((Math.random() * 10) + 1) === 3) {
          s = statusEnum.ALIVE
        }
        tiles.push(<Tile key={x + " " + y} x={x} y={y} status={s}/>)
      }
      world[x] = tiles
    }

    this.setState({world})
    setInterval(this.tick.bind(this), 200)
  }

  countNeighbors(x, y) {
    const { world } = this.state
    let neighbors = 0

    try { neighbors += world[x+1][y+1].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x-1][y-1].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x+1][y-1].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x-1][y+1].props.status === statusEnum.ALIVE } catch (e) {}

    try { neighbors += world[x-1][y].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x+1][y].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x][y+1].props.status === statusEnum.ALIVE } catch (e) {}
    try { neighbors += world[x][y-1].props.status === statusEnum.ALIVE } catch (e) {}

    return neighbors
  }

  tick() {
    let world = [...this.state.world.map(rows => [...rows])]
    for (let x=0;x<world.length;x++) {
      for (let y=0;y<world[x].length;y++) {
        const tile = world[x][y]
        const neighbors = this.countNeighbors(x,y)
        if (tile.props.status === statusEnum.ALIVE) {
          if (neighbors < 2 || neighbors > 3) {
            world[x][y] = <Tile key={x + " " + y} x={x} y={y} status={statusEnum.DEAD}/>
          }
        } else if (tile.props.status === statusEnum.DEAD) {
          if (neighbors === 3) {
            world[x][y] = <Tile key={x + " " + y} x={x} y={y} status={statusEnum.ALIVE}/>
          }
        }
      }
    }
    this.setState({world})
  }

  render() {
    const { world } = this.state
    return (
      <div className="App">
        <h1>Game of Life</h1>
        {world.map(row => <div>{row.map(tile => tile)}<div style={{clear: 'both'}}></div></div>)}
      </div>
    )
  }

}

export default App;
