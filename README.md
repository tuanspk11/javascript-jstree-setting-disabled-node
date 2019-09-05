# javascript-jstree-setting-disabled-node
    /*Add customize*/
    when node just has a leaf
        Parent(OFF), Children(OFF) => P(OFF -> ON),  C(OFF)
                                   => C(OFF -> ON),  P(ON)
                                 
        Parent(ON),  Children(ON)  => P(ON  -> OFF), C(OFF)
                                   => C(ON  -> OFF), P(ON)
        
        Parent(ON),  Children(OFF) => P(ON  -> OFF), C(OFF)
                                   => C(OFF -> ON),  P(ON)
    
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
                            ParentNodeSetting($(parent_node).hasClass('parent_node_custom') ?
                                              $(parent_node).parent()[0].parentNode : parent_node);
    
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
    
    // setting parent of disabled node
    function SetNodeHasDisabled(node, state) {
        $(node).addClass(state ? 'has_checked_dis_node' : 'has_unchecked_dis_node');
    
        var parent_node = $('#jstree').find('li[id=' + $(node).parent()[0].parentNode.id + ']');
        if (parent_node.length > 0) {
            SetNodeHasDisabled(parent_node, state);
        }
    }
    
    // check or uncheck node and children of clicked node
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
    
    // setting parent node after node was checked or unchecked
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
