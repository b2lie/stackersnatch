import './PlayerSelect.css';

function PlayerSelect({ onSelect }) {
  const hoverSound = new Audio('./sounds/select.mp3');
  const clickSound = new Audio('./sounds/chosen.mp3');

  const playHoverSound = () => {
    hoverSound.currentTime = 0; // reset to allow replaying rapidly
    hoverSound.volume = 0.2;
    hoverSound.play();
  };

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.volume = 0.2;
    clickSound.play();
  };

  const handleClick = (sprite) => {
    playClickSound();
    onSelect(sprite);
  };

  const sprites = [
    { id: 1, name: "charlie", img: './chars/char1.png' },
    { id: 2, name: "steve", img: './chars/char2.png' },
    { id: 3, name: "lucki", img: './chars/char3.png' },
    { id: 4, name: "minnie", img: './chars/char4.png' },
    { id: 5, name: "cheez", img: './chars/char5.png' },
    { id: 6, name: "ourple", img: './chars/char6.png' },
  ];

  return (
    <div>
      <h2>choose your fighter</h2>
      <div className="sprite-container">
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            className="sprite"
            onClick={() => handleClick(sprite)}
            onMouseEnter={playHoverSound}
            style={{ cursor: 'pointer', margin: '10px' }}
          >
            <img src={sprite.img} alt={sprite.name} className="sprite-img" />
            <p>{sprite.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerSelect;