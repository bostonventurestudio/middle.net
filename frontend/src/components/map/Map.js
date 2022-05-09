import React from 'react';

export const Map = props => {
    return (
        <div className="map-holder">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2947.7793863600746!2d-71.11241108474162!3d42.36854067918633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3775a88dcc653%3A0xfebc478fb7c45f70!2s950%20Massachusetts%20Ave%2C%20Cambridge%2C%20MA%2002139%2C%20USA!5e0!3m2!1sen!2s!4v1652080963621!5m2!1sen!2s"
                width="569" height="489" style={{border: 0}} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"/>
        </div>
    );
};
