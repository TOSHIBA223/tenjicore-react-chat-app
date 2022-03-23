import React from "react";
import { slide as Menu } from "react-burger-menu";
var publicItem = {
  socketId: 'public',
  img_url: '/logos/user.png',
  name: '公共ルーム'
}

export default props => {
  return (
    // Pass on our props
    <Menu right {...props}>
      <span className="MuiBadge-root bm-item" key={new Date().valueOf()} tabIndex="0" style={{display: 'block'}}>
        <span className="menu-item mUseravatar" key='public' onClick={() => props.parent.memberC(publicItem)}>
          <img alt="user" src='/logos/user.png' />
          <span title="公共ルーム" className="public">公共ルーム</span>
        </span>
      </span>
      {(() => {
        if(props.members.length > 0) {
          return <span style={{ color : "black" }}>ユーザー({props.members.length})</span>
        }
      })()}
      {
        props.members.length > 0 ? props.members.map((item) => {
          if(item['img_url'] !== "" && item['img_url'] !== "''") {
            return (
              <span className="MuiBadge-root bm-item" key={new Date().valueOf()} tabIndex="0" style={{display: 'block'}}>
                <span className="menu-item mUseravatar" key={item['socketId']} onClick={() => props.parent.memberC(item)}>
                  <img alt="user" src={item['img_url']} />
                  <span title={item['name']} className={item['socketId']}>{item['name']}</span>
                </span>
              </span>
            )
          } else if(item['name'].length > 2) {
            return (
              <span className="MuiBadge-root bm-item" key={new Date().valueOf()} tabIndex="0" style={{display: 'block'}}>
                <span className="menu-item mUseravatar" key={item['socketId']} onClick={() => props.parent.memberC(item)}>
                  <span className="noImage">{item['name'].slice(0,2)}</span>
                  <span title={item['name']} className={item['socketId']}>{item['name']}</span>
                </span>
              </span>
            )
          } else {
            return (
              <span className="MuiBadge-root bm-item" key={new Date().valueOf()} tabIndex="0" style={{display: 'block'}}>
                <span className="menu-item mUseravatar" key={item['socketId']} onClick={() => props.parent.memberC(item)}>
                  <span className="noImage">{item['name']}</span>
                  <span title={item['name']} className={item['socketId']}>{item['name']}</span>
                </span>
              </span>
            )
          }
        }) : <p>他のユーザーはいません</p>
      }
    </Menu>
  );
};
