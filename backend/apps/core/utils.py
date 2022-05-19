import uuid
from datetime import datetime


def populate_slug_for_multiple_locations(locations):
    slug = str(uuid.uuid4())[:6]
    for location in locations:
        if not location.get('slug'):
            location['slug'] = slug
    return locations


def get_open_close_time(data):
    open_at = ''
    close_at = ''
    if data.get('opening_hours') and data['opening_hours'].get('weekday_text'):
        weekday_text = data['opening_hours']['weekday_text']
        if len(weekday_text) >= datetime.today().weekday():
            time = weekday_text[datetime.today().weekday()].split(':', 1)
            if len(time) >= 1:
                time = time[1].split('–')
                open_at = time[0].strip() if time[0].strip() else ''
                close_at = time[len(time) - 1].strip() if time[len(time) - 1].strip() else ''

    if open_at == 'Open 24 hours' or close_at == 'Open 24 hours':
        return open_at, close_at
    return f'Opens {open_at}' if open_at else '', f'Closes {close_at}' if close_at else ''
