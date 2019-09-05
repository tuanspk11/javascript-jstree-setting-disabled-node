var tree_data = [
{
    "data": "TreeView_Modified", "id": "172",
    "attr": { "id": "172", "selected": false, "disabled": false, "parent_custom": false },
    "children": [
        {
            "data": "173(1)", "id": "173",
            "attr": { "id": "173", "selected": false, "disabled": false, "parent_custom": false },
            "children": [
                {
                    "data": "176(4)", "id": "176",
                    "attr": { "id": "176", "selected": true, "disabled": true, "parent_custom": true },
                    "children": [
                        {
                            "data": "188(16)", "id": "188",
                            "attr": { "id": "188", "selected": true, "disabled": true, "parent_custom": false },
                            "children": []
                        }]
                },
                {
                    "data": "179(7)", "id": "179",
                    "attr": { "id": "179", "selected": false, "disabled": false, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "182(10)", "id": "182",
                    "attr": { "id": "182", "selected": false, "disabled": false, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "185(13)", "id": "185",
                    "attr": { "id": "185", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                }]
        },
        {
            "data": "174(2)", "id": "174",
            "attr": { "id": "174", "selected": false, "disabled": false, "parent_custom": false },
            "children": [
                {
                    "data": "177(5)", "id": "177",
                    "attr": { "id": "177", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "180(8)", "id": "180",
                    "attr": { "id": "180", "selected": false, "disabled": true, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "183(11)", "id": "183",
                    "attr": { "id": "183", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "186(14)", "id": "186",
                    "attr": { "id": "186", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                }]
        },
        {
            "data": "175(3)", "id": "175",
            "attr": { "id": "175", "selected": false, "disabled": false, "parent_custom": false },
            "children": [
                {
                    "data": "178(6)", "id": "178",
                    "attr": { "id": "178", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "181(9)", "id": "181",
                    "attr": { "id": "181", "selected": false, "disabled": true, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "184(12)", "id": "184",
                    "attr": { "id": "184", "selected": true, "disabled": true, "parent_custom": false },
                    "children": []
                },
                {
                    "data": "187(15)", "id": "187",
                    "attr": { "id": "187", "selected": true, "disabled": false, "parent_custom": false },
                    "children": []
                }]
        },
        {
            "data": "189(17)", "id": "189",
            "attr": { "id": "189", "selected": false, "disabled": false, "parent_custom": false },
            "children": [
                {
                    "data": "190(18)", "id": "190",
                    "attr": { "id": "190", "selected": true, "disabled": false, "parent_custom": true },
                    "children": [
                        {
                            "data": "191(19)", "id": "191",
                            "attr": { "id": "191", "selected": false, "disabled": false, "parent_custom": false },
                            "children": []
                        }]
                }]
        },
        {
            "data": "192(20)", "id": "192",
            "attr": { "id": "192", "selected": true, "disabled": false, "parent_custom": false },
            "children": []
        },
        {
            "data": "193(21)", "id": "193",
            "attr": { "id": "193", "selected": false, "disabled": true, "parent_custom": false },
            "children": []
        },
        {
            "data": "194(22)", "id": "194",
            "attr": { "id": "194", "selected": false, "disabled": false, "parent_custom": false },
            "children": []
        },
        {
            "data": "195(23)", "id": "195",
            "attr": { "id": "195", "selected": true, "disabled": true, "parent_custom": false },
            "children": []
        },
        {
            "data": "196(24)", "id": "196",
            "attr": { "id": "196", "selected": true, "disabled": true, "parent_custom": false },
            "children": []
        }]
}];
SetDataTreeView(tree_data);


// TreeView
function SetDataTreeView(tree_data) {
    $('#jstree').jstree({
        json_data: {
            "data": tree_data
        },
        types: {
            "types": {
                "default": {
                    "check_node": function (node) {
                        $(node).hasClass('custom_checked') ? UncheckNode(node) : CheckNode(node);

                        ParentNodeSetting($(node).parent()[0].parentNode);

                        return false;
                    },
                    "uncheck_node": function (node) {
                        UncheckNode(node);

                        var parent_node = $(node).parent()[0].parentNode;
                        ParentNodeSetting($(parent_node).hasClass('parent_node_custom') ? $(parent_node).parent()[0].parentNode : parent_node);

                        return false;
                    }
                }
            }
        },
        checkbox: {
            two_state: true,
            real_checkboxes: true,
            checked_parent_open: true
        },
        plugins: ["themes", "json_data", "ui", "checkbox", "types"]
    }).bind("load_node.jstree", function () {
        $(this).find('li[disabled=disabled]').children('a').addClass('disabled_checkbox');
        $(this).find('li[selected=selected]').addClass('selected');
        $(this).find('li[parent_custom=true]').addClass('parent_node_custom');
    }).bind("loaded.jstree", function () {
        $('#jstree').jstree("open_all");
        $('#jstree').find('li[disabled=disabled]').each(function () {
            var parent_node = $('#jstree').find('li[id=' + $(this).parent()[0].parentNode.id + ']');
            if (parent_node.length > 0) {
                var bSelected = $(this).hasClass('selected');
                if ((bSelected && !$(parent_node).hasClass('has_checked_dis_node'))
                    || (!bSelected && !$(parent_node).hasClass('has_unchecked_dis_node'))) {
                    SetNodeHasDisabled(parent_node, bSelected);
                }
            }
            $(this).removeClass('selected');
        });
        $('#jstree').find('li[selected=selected]').each(function () {
            $('#jstree').jstree("check_node", this);
        });
    });
}

function SetNodeHasDisabled(node, state) {
    $(node).addClass(state ? 'has_checked_dis_node' : 'has_unchecked_dis_node');

    var parent_node = $('#jstree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
    if (parent_node.length > 0) {
        SetNodeHasDisabled(parent_node, state);
    }
}

function CheckNode(node) {
    SetNode(node, true);

    if (!$(node).hasClass('parent_node_custom') || $(node).hasClass('child_checked')) {
        $(node).children('ul').children('li[disabled!=disabled]').each(function () {
            $(this).addClass('child_checked');
            CheckNode(this);
        });
    }
    $(node).removeClass('child_checked');
}

function UncheckNode(node) {
    SetNode(node, false);

    $(node).children('ul').children('li[disabled!=disabled]').each(function () {
        UncheckNode(this);
    });
}

function SetNode(node, state) {
    if (state) {
        if ($(node).hasClass('has_unchecked_dis_node')) {
                $(node).removeClass('custom_unchecked').addClass('custom_checked');
                $(node).removeClass('jstree-unchecked').removeClass('jstree-checked').addClass('jstree-undetermined');
            } else {
                $(node).removeClass('custom_unchecked').removeClass('custom_checked');
                $(node).removeClass('jstree-unchecked').removeClass('jstree-undetermined').addClass('jstree-checked');
            }
    } else {
        if ($(node).hasClass('has_checked_dis_node')) {
            $(node).removeClass('jstree-unchecked').removeClass('jstree-checked').addClass('jstree-undetermined');
        } else {
            $(node).removeClass('jstree-undetermined').removeClass('jstree-checked').addClass('jstree-unchecked');
        }
        $(node).removeClass('custom_unchecked').removeClass('custom_checked');
    }
}

function ParentNodeSetting(node) {
    SetParentNode(node, $(node).find('li.jstree-unchecked[disabled!=disabled]').length == 0);

    var parent_node = $('#jstree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
    if (parent_node.length > 0) {
        ParentNodeSetting(parent_node);
    }
}

function SetParentNode(node, state) {
    if (state) {
        if ($(node).find('li.jstree-unchecked').length > 0) {
            $(node).removeClass('custom_unchecked').addClass('custom_checked');
            $(node).removeClass('jstree-unchecked').removeClass('jstree-checked').addClass('jstree-undetermined');
        } else {
            $(node).removeClass('custom_unchecked').removeClass('custom_checked');
            $(node).removeClass('jstree-unchecked').removeClass('jstree-undetermined').addClass('jstree-checked');
        }
    } else {
        if ($(node).find('li.jstree-checked').length > 0) {
            $(node).removeClass('jstree-unchecked').removeClass('jstree-checked').addClass('jstree-undetermined');
        } else {
            $(node).removeClass('jstree-undetermined').removeClass('jstree-checked').addClass('jstree-unchecked');
        }
        $(node).removeClass('custom_unchecked').removeClass('custom_checked');
    }
}
