$('#tree').jstree({
    types: {
        "types": {
            "default": {
                "check_node": function (node) {
                    if ($(node).hasClass('jstree-undetermined') && $(node).hasClass('custom_undetermined')) {
                        if (!$(node).hasClass('child_checked') && $(node).hasClass('custom_unchecked')) {
                            this.uncheck_node(node);
                            return false;
                        }
                    }

                    $(node).children('ul').children('li').each(function () {
                        if (!$(this).hasClass('jstree-checked') && !$(this).hasClass('disabled_checkbox')) {
                            $(this).addClass('child_checked');
                            $('#tree').jstree("check_node", this);
                        }
                    });
                    $(node).removeClass('child_checked');

                    if ($(node).hasClass('jstree-leaf')) {
                        CheckedRecursive(node);
                        return true;
                    }
                    return false;
                },
                "uncheck_node": function (node) {
                    $(node).children('ul').children('li').each(function () {
                        if (!$(this).hasClass('jstree-unchecked') && !$(this).hasClass('disabled_checkbox')) {
                            $('#tree').jstree("uncheck_node", this);
                        }
                    });

                    if ($(node).hasClass('jstree-leaf')) {
                        UncheckedRecursive(node);
                        return true;
                    }
                    return false;
                }
            }
        }
    },
    checkbox: {
        real_checkboxes: true,
        checked_parent_open: true
    },
    plugins: ["themes", "ui", "checkbox", "types"]
}).bind("load_node.jstree", function () {
    $(this).find('li[disabled=disabled]').addClass('disabled_checkbox');
}).bind("loaded.jstree", function () {
    $('#tree').find('li[disabled=disabled]').each(function () {
        UndeterminedNodeSetting(this);
    });
});

// parent nodes have some disabled child nodes (uncheck)
function UndeterminedNodeSetting(node) {
    var parent_node = $('#tree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
    parent_node.addClass('custom_undetermined');
    if (parent_node.length > 0) {
        UndeterminedNodeSetting(parent_node);
    }
}

// check node
function CheckedRecursive(node, is_check) {
    if ($(node).hasClass('custom_undetermined')) {
        $(node).removeClass(is_check == undefined ? 'custom_unchecked' : 'custom_checked');
        $(node).addClass(is_check == undefined ? 'custom_checked' : 'custom_unchecked');
    }

    var parent_node = $('#tree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
    if (parent_node.length > 0) {
        var count = 0;
        parent_node.find('li[disabled!=disabled]').each(function () {
            if ($(this).hasClass('jstree-leaf')) {
                count += $(this).hasClass('jstree-unchecked') ? 1 : 0;
            }
        });
        count <= 1 ? CheckedRecursive(parent_node, true) : CheckedRecursive(parent_node);
    }
}

// uncheck node
function UncheckedRecursive(node) {
    if ($(node).hasClass('custom_undetermined')) {
        $(node).removeClass('custom_unchecked');
        $(node).addClass('custom_checked');
    }

    var parent_node = $('#tree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
    if (parent_node.length > 0) {
        UncheckedRecursive(parent_node);
    }
}
