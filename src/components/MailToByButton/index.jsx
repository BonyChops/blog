import React from "react";

function MailToByButton(props){
    const {itemname} = props;
    const subject = encodeURIComponent(`${itemname} 購入希望`);
    const body = encodeURIComponent(`${itemname}を購入したいです！\n\n・購入品名: ${itemname}\n・購入者名: \n・学年: \n・支払い方法: \n\n※上記の空欄を埋め，送信してください\n※まとめ買いで1冊に付き200円の割引を適用できます．まとめ買いをする場合は，上記にまとめて買いたいものを記載してください．詳しくは以下↓\nhttp://blog.b7s.dev/2023/03/11/ec-like-blog#%E5%89%B2%E5%BC%95`);
    return(
        <a
            className="clean-btn button button--primary"
            href={`mailto:contact@bonychops.com?subject=${subject}&body=${body}`}
            target="_blank"
            rel="noopener noreferrer"
        >問い合わせる！</a>
    )
}

function imagesArrayToMap(array){
    return array.map(v => ({
        original: v,
        thumbnail: v
    }))
}

export {MailToByButton, imagesArrayToMap}