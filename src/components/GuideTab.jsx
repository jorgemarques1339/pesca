import React from 'react';

const GuideTab = ({ active }) => {
  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5, width: '100%' }}>
      <h1 className="ios-large-title">Tamanhos Mínimos</h1>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Consulte sempre a legislação em vigor. Medida da ponta do focinho à extremidade da barbatana caudal.</p>
      
      <div className="scale-item">
        <span className="scale-name">Robalo (Dicentrarchus labrax)</span>
        <span className="scale-size">36 cm</span>
      </div>
      <div className="scale-item">
        <span className="scale-name">Sargo (Diplodus sargus)</span>
        <span className="scale-size">15 cm</span>
      </div>
      <div className="scale-item">
        <span className="scale-name">Dourada (Sparus aurata)</span>
        <span className="scale-size">19 cm</span>
      </div>
      <div className="scale-item">
        <span className="scale-name">Polvo (Octopus vulgaris)</span>
        <span className="scale-size">750 g</span>
      </div>
      <div className="scale-item">
        <span className="scale-name">Choco (Sepia officinalis)</span>
        <span className="scale-size">10 cm</span>
      </div>
      <div className="scale-item">
        <span className="scale-name">Linguado (Solea solea)</span>
        <span className="scale-size">24 cm</span>
      </div>
    </div>
  );
};

export default GuideTab;
