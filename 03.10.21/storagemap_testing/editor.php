<html>
        <head>
        <?php require("sessionCheck.php"); ?>
        <?php require("editorhead.php"); ?>
        <?php require("mainhead.php"); ?>
        <style>
            #canvas_id {
                /* border: solid; */
                width: 100%;
                height: 99%;
            }

            #shelf_templates {
                display: none;
            }
            #shelf_templates > * {
                margin-left: 1%;
            }
            #shelf_templates button {
                font-size: 140%;
            }
            #shelf_templates input {
                font-size: 130%;
            }
            #shelf_templates_list * {
                font-size: 140%;
            }
            #shelf_templates_list * input {
                width: 3%;
                height: 3%;
            }

            #edit_templates {
                display: none;
            }
            #edit_templates {
                margin-left: 1%;
            }
            #edit_templates > * {
                font-size: 140%;
            }
            #edit_templates_list > * {
                font-size: 140%;
            }
            #edit_templates_list button {
                font-size: 60%;
                margin-left: 1%;
            }
            .editTemplateItem {
                border: 1px solid;
                border-style: none solid solid solid;
            }

            #command_menu {
            }
            .command_button {
                margin-top: 0.5%;
                font-size: 100%;
            }
            body {
                margin: 0;
            }
        </style>
        <script src="editor.js?random=<?php echo uniqid(); ?>"></script>
    </head>
    
    <body>
        <div id="main_element">
            <div id="command_menu">
                <button type="button" class="command_button" id="save_button">
                    Сохранить
                </button>
                <button type="button" class="command_button" id="edit_button">
                    Редактировать полку
                </button>
                <button type="button" class="command_button" id="move_button">
                    Поменять полки местами
                </button>
                <button type="button" class="command_button" id="replace_button">
                    Переместить полку
                </button>
                <button type="button" class="command_button" id="copy_button">
                    Копировать полку
                </button>
                <button type="button" class="command_button" id="edit_templates_button">
                    Редактировать шаблоны
                </button>
                <button type="button" class="command_button" id="shelf_templates_button">
                    Редактировать шаблоны полки
                </button>
                <button type="button" class="command_button" id="add_shelf_button">
                    Добавить полку
                </button>
                <button type="button" class="command_button" id="delete_shelf_button">
                    Удалить полку
                </button>
                <button type="button" class="command_button" id="help_button">
                    Помощь
                </button>
            </div>
            <?php require("mainbody.php"); ?>
        </div>

        <div id="shelf_templates">
            <input type="text" id="shelf_templates_search_field"></input>
            <button id="shelf_templates_save_button">Сохранить</button>
            <button id="shelf_templates_cancel_button">Отменить</button>
            <br>

            <div id="shelf_templates_list"></div>

        </div>
        <div id="edit_templates">
            <input type="text" id="edit_templates_search_field"></input>
            <button id="edit_templates_add_button">Добавить</button>
            <button id="edit_templates_save_button">Сохранить</button>
            <button id="edit_templates_cancel_button">Отменить</button>
            <br>

            <div id="edit_templates_list"></div>

        </div>
    </body>
</html>
