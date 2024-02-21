from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def active_link(context, url_name, link_text):
    request = context['request']
    current_path = request.path
    active = 'active' if current_path == context['request'].resolver_match.view_name else ''
    link = f'<a href="{template.defaulttags.url(context, url_name)}" class="nav-item nav-link {active}">{link_text}</a>'
    return link
