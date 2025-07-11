package com.finalteam.loacompass.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardSetDto {
    @JsonProperty("Name")
    private String name;
    @JsonProperty("Description")
    private String description;
}