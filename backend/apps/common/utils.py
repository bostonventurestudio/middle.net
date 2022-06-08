# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

from email.mime.image import MIMEImage
import logging
import mimetypes

from django.conf import settings

from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


def set_inline_image_attachments(email_images):
    """
    Set the image attachments in an email.

    :param email_images:
    :return:
    """
    email_images_list = []
    if email_images:
        for email_image in email_images:
            image_id = email_image['id']
            file_path = '{}/{}/src/img/{}'.format(settings.BASE_DIR, settings.STATIC_ROOT, email_image['name'])
            ctype, encoding = mimetypes.guess_type(file_path)
            if ctype is None or encoding is not None:
                ctype = 'application/octet-stream'
            _, subtype = ctype.split('/', 1)
            with open(file_path, 'rb') as file_pointer:
                msg_image = MIMEImage(file_pointer.read(), _subtype=subtype)
                msg_image.add_header('Content-ID', '<{}>'.format(image_id))
                msg_image.add_header('Content-Disposition', 'attachment', filename=email_image['name'])
                email_images_list.append(msg_image)

    return email_images_list


def send_mail_to_user(receivers, subject, message, html_message, cc=None, from_email=None, email_images=None,
                      reply_to=None, preference_id=None, csv_file=None, csv_file_name=None):
    """
    Send single mail to given users.

    :param reply_to: list of strings of the form 'Sender <sender@email.com>'
    :param from_email:
    :param email_images:
    :param receivers:
    :param subject:
    :param message:
    :param html_message:
    :param cc:
    :param csv_file:
    :param csv_file_name:
    :return:
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    try:
        if settings.SEND_MAIL:
            email_images_list = set_inline_image_attachments(email_images)
            if email_images_list:
                email_message = EmailMultiAlternatives(subject, html_message, from_email, receivers, cc=cc,
                                                        reply_to=reply_to)
                email_message.content_subtype = 'html'
                email_message.mixed_subtype = 'related'
                for email_image in email_images_list:
                    email_message.attach(email_image)
            elif csv_file and csv_file_name:
                email_message = EmailMultiAlternatives(subject, message, from_email, receivers, cc=cc,
                                                        reply_to=reply_to)
                email_message.attach(csv_file_name, csv_file.getvalue(), 'text/csv')
            else:
                email_message = EmailMultiAlternatives(subject, message, from_email, receivers, cc=cc,
                                                        reply_to=reply_to)
                email_message.attach_alternative(html_message, 'text/html')
            email_message.send()

            return True
    except Exception:
        error_msg = 'Error occured while sending mail to {}'.format(str(receivers))
        logger.exception(error_msg)
        return False
